import pino from 'pino';
import axios from 'axios';
import crypto from 'crypto';
import CryptoJS from 'crypto-js';
import { badRequestFault, downStreamErrorAxios } from '../shared/utils/ErrorHandler.js';

const logger = pino({
  level: process.env.PINO_LOG_LEVEL || 'info',
});

//creates an authorization header needed for calls to fiserv
export const generateAuthHeader = async (event, credentials) => {
  try {
    var key = credentials.apiKey;
    var secret = credentials.apiSecret;

    var ClientRequestId = Math.floor(Math.random() * 10000000 + 1);

    var time = new Date().getTime();

    var requestBody = JSON.stringify(event);
    var rawSignature = key + ClientRequestId + time + requestBody;

    var computedHash = CryptoJS.algo.HMAC.create(CryptoJS.algo.SHA256, secret.toString());
    computedHash.update(rawSignature);
    computedHash = computedHash.finalize();
    var computedHmac = CryptoJS.enc.Base64.stringify(computedHash);

    var authHeaderInfo = {
      key: key,
      time: time,
      signature: computedHmac,
      clientRequestId: ClientRequestId,
    };

    return authHeaderInfo;
  } catch (error) {
    throw new Error(JSON.stringify(badRequestFault(error, event, 'Generate Auth Header.')));
  }
};

//used to generateKey for credit card encryption
export const generateKey = async (merchantDetails, authHeaderInfo) => {
  try {
    const fiservHeaders = {
      'Content-Type': 'application/json',
      'Api-Key': authHeaderInfo.key,
      'Timestamp': authHeaderInfo.time,
      'Client-Request-Id': authHeaderInfo.clientRequestId,
      'Authorization': authHeaderInfo.signature,
      'Auth-Token-Type': 'HMAC',
    };
  
    let fiservGenerateKeyRes = await axios.post(`${process.env.FISERV_URL}security/v1/keys/generate`, merchantDetails, {headers: fiservHeaders});
  
    return fiservGenerateKeyRes.data;
  } catch (error) {
    throw new Error(JSON.stringify(downStreamErrorAxios(error, 'Fiserv Call to generate key.')))
  }
  
};

//used to encrypt credit card information using public key generated in generateKey call
export const createEncryption = async (keyInfo, cardData) => {
  try {
    // Utils
    const toArrayBuffer = (str) => {
      const buf = new ArrayBuffer(str.length);
      const bufView = new Uint8Array(buf);
      for (let i = 0; i < str.length; i++) {
          bufView[i] = str.charCodeAt(i);
      }
      return buf;
    };

    const toBase64Encode = (arrayBuffer) => btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));

    // RSA Algorithm
    const asymmerticallyEncrypt = async (base64PubKey, sourceString) => {
      const keyBuf = toArrayBuffer(atob(base64PubKey));
      const pubKeyDer = await crypto.subtle.importKey("spki", keyBuf, { name: "RSA-OAEP", hash: "SHA-256", }, true, ["encrypt"]);
      const encryptedBlock = await crypto.subtle.encrypt({name: "RSA-OAEP",}, pubKeyDer, new TextEncoder().encode(sourceString));
      return toBase64Encode(encryptedBlock);
    };

    const encryptionBlock = await asymmerticallyEncrypt(keyInfo.asymmetricKeyDetails.encodedPublicKey, Object.values(cardData).join(""));
    const encoder = new TextEncoder();
    const encryptionBlockFields = Object.keys(cardData).map(key => `card.${key}:${encoder.encode(cardData[key]).length}`).join(',');
    const payload = {
                keyId: keyInfo.asymmetricKeyDetails.keyId,
                encryptionType: "RSA",
                encryptionBlock: encryptionBlock,
                encryptionBlockFields: encryptionBlockFields,
                encryptionTarget: "MANUAL"
    };
    
    return payload;

  } catch (error) {
    throw new Error(JSON.stringify(badRequestFault(error, 'createEncryption call')));
  }
};
