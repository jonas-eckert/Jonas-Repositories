import { downStreamError, downStreamErrorAxios, generalServerFault } from '../shared/utils/ErrorHandler.js';
import { generateAuthHeader, generateKey, createEncryption } from './CommonAuthFunc.js';
import { fetchSecret } from '../shared/utils/FetchSecrets.js';
import pino from 'pino';
import axios from 'axios';

const logger = pino({
  level: process.env.PINO_LOG_LEVEL || 'info',
});

let credentials, keyInformation, encryptedCCData, fiservRequest, fiservResponse;
let generateKeyReq = {
  merchantDetails: {
    merchantId: '100173000000053',
    terminalId: '10000001',
  },
};

export let authCreditCard = async (event) => {
  //event logging
  let eventLog = JSON.parse(JSON.stringify(event));
  if(process.env.STAGE === 'prd'){
    delete eventLog.body.Payment.PaymentDetail.CreditCardDetail;
  }
  logger.debug({ eventLog }, 'Fiserv-Transaction-Service-Utility/AuthCreditCard Request event.');

  //creates authHeader for generateKey call, makes generateKey call for encrypting data.
  try {
    //fetch secrets, credentials can be reused.
    credentials = await fetchSecret(`/${process.env.STAGE}/soa/Fiserv/apiCredentials`);

    //make GenerateAuthHeader function call for generateKey function
    let authHeaderKeyResponse = await generateAuthHeader(generateKeyReq, credentials);

    //use authHeaderInfo to make generateKey call, keyInformation needed in actual call
    keyInformation = await generateKey(generateKeyReq, authHeaderKeyResponse);

    logger.debug({keyInformation}, "keyInformation")
  } catch (error) {
    throw new Error(JSON.stringify(generalServerFault(error)));
  }

  //call createEncryption to encrypt CC information
  try {
    //create cardData payload for encryption
    let cardDataObject = {};
    if (event.Payment && event.Payment.PaymentDetail && event.Payment.PaymentDetail.CreditCardDetail) {
      let ccDetails = event.Payment.PaymentDetail.CreditCardDetail;
      if (ccDetails.pan) {
        cardDataObject.cardData = ccDetails.pan;
      }
      if (ccDetails.nameOnCard) {
        cardDataObject.nameOnCard = ccDetails.nameOnCard;
      }
      if (ccDetails.expirationDate) {
        cardDataObject.expirationMonth = String(ccDetails.expirationDate).substring(0, 2);
        cardDataObject.expirationYear = '20' + String(ccDetails.expirationDate).substring(2, 4);
      }
      if (ccDetails.securityCode) {
        cardDataObject.securityCode = ccDetails.securityCode;
      }
    }
    encryptedCCData = await createEncryption(keyInformation, cardDataObject);

    logger.debug({encryptedCCData}, "encryptedCCData")
  } catch (error) {
    throw new Error(JSON.stringify(downStreamError(error, event, 'Create Encryption Call')));
  }

  //transform Mason CO to Fiserv Object
  try {
    fiservRequest = authCreditCard_Request(event, encryptedCCData);
    
    logger.debug({fiservRequest}, "Fiserv Request.")
  } catch (error) {
    throw new Error(JSON.stringify(generalServerFault(error)));
  }

  //make call to Fiserv
  try {
    //create another authHeader
    let authHeaderResponse = await generateAuthHeader(fiservRequest, credentials);

    const fiservHeaders = {
      'Content-Type': 'application/json',
      'Api-Key': authHeaderResponse.key,
      'Timestamp': authHeaderResponse.time,
      'Client-Request-Id': authHeaderResponse.clientRequestId,
      'Authorization': authHeaderResponse.signature,
      'Auth-Token-Type': 'HMAC',
    };


    //fiserv call
    fiservResponse = await axios.post(`${process.env.FISERV_URL}payments-vas/v1/accounts/verification`, fiservRequest, {
      headers: fiservHeaders,
    });

    logger.debug(fiservResponse.data, "Fiserv Response.")
  } catch (error) {
    throw new Error(JSON.stringify(downStreamErrorAxios(error, 'Fiserv API call')));
  }

  //transform from Fiserv Object to Mason CO and return response
  try {
    let response = authCreditCard_Response(fiservResponse.data);

    logger.debug({response}, 'AuthCreditCard Transformed Response')
    return response;
  } catch (error) {
    throw new Error(JSON.stringify(generalServerFault(error)));
  }
};

/**
 *
 * @param {*} inBody incoming request payload
 * @param {*} inEncryptedCCData the encrypted credit card data using authHeader, generateKey and createEncryption calls
 * @returns Fiserv request object
 */
export const authCreditCard_Request = (inBody, inEncryptedCCData) => {
  let outBody = {
    source: {
      sourceType: 'PaymentCard',
      tokenSource: 'TRANSARMOR',
      encryptionData: inEncryptedCCData,
    },
    transactionDetails: {
      captureFlag: false,
      primaryTransactionType: 'AUTH_ONLY',
      merchantOrderId: 'Mason Payment',
    },
    billingAddress: {
      address: {
        country: 'US',
      },
    },
    merchantDetails: {
      tokenType: 'LHC0',
      merchantId: '100173000000053',
      terminalId: '10000001',
    },
  };

  if (inBody.Payment && inBody.Payment.BillingAddress) {
    let inBillAdd = inBody.Payment.BillingAddress;
    if (inBillAdd.PersonInfo) {
      if (inBillAdd.PersonInfo.firstName) {
        outBody.billingAddress.firstName = inBillAdd.PersonInfo.firstName;
      }
      if (inBillAdd.PersonInfo.lastName) {
        outBody.billingAddress.lastName = inBillAdd.PersonInfo.lastName;
      }
    }
    if (inBillAdd.LocationInfo) {
      if (inBillAdd.LocationInfo.line1) {
        outBody.billingAddress.address.street = inBillAdd.LocationInfo.line1;
      }
      if (inBillAdd.LocationInfo.line2) {
        outBody.billingAddress.address.houseNumberOrName = inBillAdd.LocationInfo.line2;
      }
      if (inBillAdd.LocationInfo.city) {
        outBody.billingAddress.address.city = inBody.Payment.BillingAddress.LocationInfo.city;
      }
      if (inBillAdd.LocationInfo.state) {
        outBody.billingAddress.address.stateOrProvince = inBillAdd.LocationInfo.state;
      }
      if (inBillAdd.LocationInfo.zip) {
        outBody.billingAddress.address.postalCode = inBillAdd.LocationInfo.zip;
      }
      if (inBillAdd.LocationInfo.emailAddress) {
        outBody.customer = {
          email: inBillAdd.LocationInfo.emailAddress,
        };
      }
    }
  }

  if (inBody.Customer) {
    if (inBody.Customer.CustomerInfo && inBody.Customer.CustomerInfo.omsCustomerId) {
      outBody.transactionDetails.merchantInvoiceNumber = inBody.Customer.CustomerInfo.omsCustomerId;
      outBody.transactionDetails.merchantOrderId = inBody.Customer.CustomerInfo.omsCustomerId;
    } else if (
      inBody.Customer.DivisionCustomers &&
      inBody.Customer.DivisionCustomers.length > 0 &&
      inBody.Customer.DivisionCustomers[0].WebAccounts &&
      inBody.Customer.DivisionCustomers[0].WebAccounts.length > 0 &&
      inBody.Customer.DivisionCustomers[0].WebAccounts[0].webAccountId
    ) {
      outBody.transactionDetails.merchantInvoiceNumber =  inBody.Customer.DivisionCustomers[0].WebAccounts[0].webAccountId;
      outBody.transactionDetails.merchantOrderId = inBody.Customer.DivisionCustomers[0].WebAccounts[0].webAccountId;
    }
    if (
      inBody.Customer.DivisionCustomers &&
      inBody.Customer.DivisionCustomers.length > 0 &&
      inBody.Customer.DivisionCustomers[0].PhoneRecords &&
      inBody.Customer.DivisionCustomers[0].PhoneRecords.length > 0 &&
      inBody.Customer.DivisionCustomers[0].PhoneRecords[0].PhoneInfo &&
      inBody.Customer.DivisionCustomers[0].PhoneRecords[0].PhoneInfo.phoneNumber
    ) {
      outBody.billingAddress.phone = {
        phoneNumber: inBody.Customer.DivisionCustomers[0].PhoneRecords[0].PhoneInfo.phoneNumber,
      };
    }
  }
  return outBody;
};

/**
 * Transforms from an Fiserv Object to Mason CO
 * @param {*} inBody the response body from fiserv
 * @returns Mason Common object
 */
export const authCreditCard_Response = (inBody) => {
  let outBody = {
    ResultMetaData: {},
    Payment: {
      TransactionDetail: {
        createdOn: new Date()
      }
    }
  };

  if (inBody.gatewayResponse &&inBody.gatewayResponse.transactionProcessingDetails){
    if(inBody.gatewayResponse &&inBody.gatewayResponse.transactionProcessingDetails.transactionId) {
      outBody.Payment.TransactionDetail.transactionTag = inBody.gatewayResponse.transactionProcessingDetails.transactionId;
    }
    if(inBody.gatewayResponse && inBody.gatewayResponse.transactionProcessingDetails.transactionId) {
      outBody.ResultMetaData.Times = {
        submitted: inBody.gatewayResponse.transactionProcessingDetails.transactionTimestamp,
        completed: new Date()
      } 
    }
  }

  if (inBody.paymentTokens && inBody.paymentTokens.length>0){
    outBody.Payment.TransactionDetail.panTokenized = inBody.paymentTokens[0].tokenData;
  }

  if (inBody.processorResponseDetails) {
    let inProcResDet = inBody.processorResponseDetails;

    if (inProcResDet.approvalStatus) {
      if (inProcResDet.approvalStatus === 'APPROVED') {
        outBody.code = 'OK';
      } else if (inProcResDet.approvalStatus === 'DECLINED') {
        outBody.code = 'OK';
      } else {
        outBody.code = 'FAILED';
      }
      if (/APPROVED|DECLINED|PROCESSING_FAILED|VALIDATION_FAILED|WAITING/.test(inProcResDet.approvalStatus)) {
        outBody.Payment.TransactionDetail.transactionStatus = inProcResDet.approvalStatus;
      } else {
        throw new Error('Approval Status not valid.');
      }
    }
    if (inProcResDet.responseCode) {
      outBody.Payment.TransactionDetail.transactionResultCode = inProcResDet.responseCode;
    }
    if (inProcResDet.responseMessage) {
      outBody.Payment.TransactionDetail.transactionResultMessage = inProcResDet.responseMessage;
    }
    if (inProcResDet.referenceNumber) {
      outBody.Payment.TransactionDetail.transactionId = inProcResDet.referenceNumber;
    }
    if (inProcResDet.hostResponseMessage) {
      outBody.Payment.TransactionDetail.bankMessage = inProcResDet.hostResponseMessage;
    }
    if (inProcResDet && inProcResDet.responseCode) {
      outBody.Payment.TransactionDetail.bankCode = inProcResDet.responseCode;
    }
    if (inProcResDet.bankAssociationDetails && inProcResDet.bankAssociationDetails.avsSecurityCodeResponse && inProcResDet.bankAssociationDetails.avsSecurityCodeResponse.association) {
      let CVV, AVS;
      if(inProcResDet.bankAssociationDetails.avsSecurityCodeResponse.association.securityCodeResponse){
        outBody.Payment.TransactionDetail.cvvResponseCode = inProcResDet.bankAssociationDetails.avsSecurityCodeResponse.association.securityCodeResponse;
        CVV = inProcResDet.bankAssociationDetails.avsSecurityCodeResponse.association.securityCodeResponse;
      }
      if(inProcResDet.bankAssociationDetails.avsSecurityCodeResponse.association.avsCode){
        outBody.Payment.TransactionDetail.avsResponseCode = inProcResDet.bankAssociationDetails.avsSecurityCodeResponse.association.avsCode;
        AVS = inProcResDet.bankAssociationDetails.avsSecurityCodeResponse.association.avsCode;
      }
      let buildValidityCheck = []
      //Payment Acceptance Rules
      if((CVV === "M" && /A|D|E|F|K|L|M|N|O|S|U|W|X|Y|Z/.test(AVS)) || (CVV === "N" && /M|X|Y/.test(AVS))){
        buildValidityCheck.push("PaymentAcceptable");
      }
      //Order Acceptance Rules
      if((CVV === "M" || CVV === "N") && /A|D|E|F|G|K|L|M|N|O|R|S|U|W|X|Y|Z/.test(AVS)){
        buildValidityCheck.push("OrderAcceptable")
      }
      //Savable Account Rules
      if(CVV === "M" && /A|D|E|F|L|M|O|W|X|Y|Z/.test(AVS)){
        buildValidityCheck.push("Savable")
      }
      if(buildValidityCheck.length>0 && inProcResDet.approvalStatus === 'APPROVED'){
        outBody.Payment.TransactionDetail.ValidityChecks = buildValidityCheck;    
      }
    
    }
    if (inProcResDet.hostResponseMessage && inProcResDet.bankAssociationDetails && inProcResDet.bankAssociationDetails.associationResponseCode) {
      outBody.message = inProcResDet.bankAssociationDetails.associationResponseCode + ' : ' + inProcResDet.hostResponseMessage;
    }
  }

  if (inBody.source && inBody.source.card && inBody.source.card.scheme) {
    if(inBody.source.card.scheme === 'VISA'){
      outBody.Payment.TransactionDetail.cardIssuerName = 'Visa'
    }
    else if(inBody.source.card.scheme === 'MASTERCARD'){
      outBody.Payment.TransactionDetail.cardIssuerName = 'Mastercard'
    }
    else if(inBody.source.card.scheme === 'AMEX'){
      outBody.Payment.TransactionDetail.cardIssuerName = 'AmericanExpress'
    }
    else if(inBody.source.card.scheme === 'DISCOVER'){
      outBody.Payment.TransactionDetail.cardIssuerName = 'Discover'
    }
  }

  return outBody;
};
