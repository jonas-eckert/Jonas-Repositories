import axios from 'axios';
import pino from 'pino';
import { downStreamError, downStreamErrorAxios, generalServerFault } from '../shared/utils/ErrorHandler.js';
import { generateAuthHeader, generateKey, createEncryption } from './CommonAuthFunc.js';
import { fetchSecret } from '../shared/utils/FetchSecrets.js';

const logger = pino({ 
  level: process.env.PINO_LOG_LEVEL || 'info',
});

let credentials, keyInformation, encryptedCCData, fiservRequest, fiservResponse, panTokenized;
let generateKeyReq = {
  merchantDetails: {
    merchantId: '100173000000053',
    terminalId: '10000001',
  },
};

export let submitPayment = async (event) => {
  //event logging
  let eventLog = JSON.parse(JSON.stringify(event));
  if(process.env.STAGE === 'prd'){
    delete eventLog.body.Payment.PaymentDetail.CreditCardDetail;
  }
  logger.debug({ eventLog }, 'Fiserv-Transaction-Service-Utility Request event.');

  //creates authHeader for generateKey call, makes generateKey call for encrypting data.
  try {
    //fetch secrets, credentials can be reused.
    credentials = await fetchSecret(`/${process.env.STAGE}/soa/Fiserv/apiCredentials`);

    //make GenerateAuthHeader function call for generateKey function
    let authHeaderKeyResponse = await generateAuthHeader(generateKeyReq, credentials);

    //use authHeaderInfo to make generateKey call, keyInformation needed in actual call
    keyInformation = await generateKey(generateKeyReq, authHeaderKeyResponse);

    logger.debug({ keyInformation }, "keyInformation")
  } catch (error) {
    throw new Error(JSON.stringify(generalServerFault(error)));
  }
    //call createEncryption to encrypt CC information
    try {
      //create cardData payload for encryption
      let cardDataObject = {};
      if (event.Payment && event.Payment.PaymentDetail && event.Payment.PaymentDetail.CreditCardDetail && event.Payment.PaymentDetail.CreditCardDetail.pan) {
        let ccDetails = event.Payment.PaymentDetail.CreditCardDetail;
          
        cardDataObject.cardData = ccDetails.pan;
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
        encryptedCCData = await createEncryption(keyInformation, cardDataObject);
        logger.debug({encryptedCCData}, "encryptedCCData")
      }
    } catch (error) {
      throw new Error(JSON.stringify(downStreamError(error, event, 'Create Encryption Call')));
    }

  //transfrom from Mason CO to Fiserv Object
  try {
    fiservRequest = submitPayment_Request(event, encryptedCCData);

    logger.debug({fiservRequest}, "Fiserv Request.")
  } 
  catch (error) {
    throw new Error(JSON.stringify(generalServerFault(error)));
  }

  //Create auth header and make call to Fiserv
  try {
    //authHeader creation
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
    fiservResponse = await axios.post(`${process.env.FISERV_URL}payments/v1/charges`, fiservRequest, {
      headers: fiservHeaders,
    });

    logger.debug(fiservResponse.data , "Fiserv Response.")
  } 
  catch (error) {
    throw new Error(JSON.stringify(downStreamErrorAxios(event, 'Fiserv API call')));
  }

  //transform from Fiserv Object to Mason CO
  try {
    let response = submitPayment_Response(fiservResponse.data, panTokenized);

    logger.debug({response}, 'SubmitPayment Transformed Response')
    return response;
  } 
  catch (error) {
    throw new Error(JSON.stringify(generalServerFault(error)));
  }
};

export const submitPayment_Request = (inBody,encryptedCCData) => {
  let outBody = {
    amount: {
      currency: 'USD',
    },
    source: {},
    transactionDetails: {
      captureFlag: true,
      primaryTransactionType: 'CHARGE_SALE',
      merchantOrderId: 'Mason Payment',
    },
    billingAddress: {
      address: {
        country: 'US',
      },
    },
    merchantDetails: {
      merchantId: '100173000000053',
      terminalId: '10000001',
    },
  };

  if (inBody.Payment) {
    if (inBody.Payment.PaymentInfo && (inBody.Payment.PaymentInfo.amount || inBody.Payment.PaymentInfo.amount === 0)) {
      outBody.amount.total = Math.round(inBody.Payment.PaymentInfo.amount * 100);
    }
    if (inBody.Payment.PaymentDetail && inBody.Payment.PaymentDetail.CreditCardDetail) {
      if (inBody.Payment.PaymentDetail.CreditCardDetail.panTokenized) {
        outBody.source.sourceType = 'PaymentToken';
        outBody.source.tokenSource = 'TRANSARMOR';
        outBody.source.tokenData = inBody.Payment.PaymentDetail.CreditCardDetail.panTokenized;
        //used in response
        panTokenized = inBody.Payment.PaymentDetail.CreditCardDetail.panTokenized;
        let buildCard = {};
        if (inBody.Payment.PaymentDetail.CreditCardDetail.nameOnCard) {
          buildCard.nameOnCard = inBody.Payment.PaymentDetail.CreditCardDetail.nameOnCard;
        }
        if (inBody.Payment.PaymentDetail.CreditCardDetail.expirationDate) {
          //taking apart month/year
          buildCard.expirationMonth = String(inBody.Payment.PaymentDetail.CreditCardDetail.expirationDate).substring(0,2);
          buildCard.expirationYear = '20' + String(inBody.Payment.PaymentDetail.CreditCardDetail.expirationDate).substring(2, 4);
        }
        if (inBody.Payment.PaymentDetail.CreditCardDetail.cardIssuerName) {
          if (inBody.Payment.PaymentDetail.CreditCardDetail.cardIssuerName === 'AmericanExpress') {
            buildCard.scheme = 'AMEX';
          }
          if (inBody.Payment.PaymentDetail.CreditCardDetail.cardIssuerName === 'Visa') {
            buildCard.scheme = 'VISA';
          }
          if (inBody.Payment.PaymentDetail.CreditCardDetail.cardIssuerName === 'Discover') {
            buildCard.scheme = 'DISCOVER';
          }
          if (inBody.Payment.PaymentDetail.CreditCardDetail.cardIssuerName === 'Mastercard') {
            buildCard.scheme = 'MASTERCARD';
          }
        }
        outBody.source.card = buildCard;
      } else if (encryptedCCData) {
        outBody.source.sourceType = 'PaymentCard';
        outBody.source.encryptionData = encryptedCCData;
      }
    }
  }
  
  if (inBody.Customer) {
    if (inBody.Customer.CustomerInfo && inBody.Customer.CustomerInfo.omsCustomerId) {
      outBody.transactionDetails.merchantOrderId = inBody.Customer.CustomerInfo.omsCustomerId;
      outBody.transactionDetails.merchantInvoiceNumber = inBody.Customer.CustomerInfo.omsCustomerId;
    } else if (
      inBody.Customer.DivisionCustomers &&
      inBody.Customer.DivisionCustomers.length > 0 &&
      inBody.Customer.DivisionCustomers[0].WebAccounts &&
      inBody.Customer.DivisionCustomers[0].WebAccounts.length > 0 &&
      inBody.Customer.DivisionCustomers[0].WebAccounts[0].webAccountId
    ) {
      outBody.transactionDetails.merchantOrderId = inBody.Customer.DivisionCustomers[0].WebAccounts[0].webAccountId;
      outBody.transactionDetails.merchantInvoiceNumber = inBody.Customer.DivisionCustomers[0].WebAccounts[0].webAccountId;
    }
    if (
      inBody.Customer.BillingAddress &&
      inBody.Customer.BillingAddress &&
      inBody.Customer.BillingAddress.LocationInfo
    ) {
      let inLocInfo = inBody.Customer.BillingAddress.LocationInfo;
      if (inLocInfo.line1) {
        outBody.billingAddress.address.street = inLocInfo.line1;
      }
      if (inLocInfo.line2) {
        outBody.billingAddress.address.houseNumberOrName = inLocInfo.line2;
      }
      if (inLocInfo.city) {
        outBody.billingAddress.address.city = inLocInfo.city;
      }
      if (inLocInfo.state) {
        outBody.billingAddress.address.stateOrProvince = inLocInfo.state;
      }
      if (inLocInfo.zip) {
        outBody.billingAddress.address.postalCode = inLocInfo.zip;
      }
    }
    if (inBody.Customer.DivisionCustomers && 
        inBody.Customer.DivisionCustomers.length > 0 &&
        inBody.Customer.DivisionCustomers[0].PhoneRecords &&
        inBody.Customer.DivisionCustomers[0].PhoneRecords.length > 0 &&
        inBody.Customer.DivisionCustomers[0].PhoneRecords[0].PhoneInfo &&
        inBody.Customer.DivisionCustomers[0].PhoneRecords[0].PhoneInfo.phoneNumber) {
      outBody.billingAddress.phone = {
        phoneNumber: inBody.Customer.DivisionCustomers[0].PhoneRecords[0].PhoneInfo.phoneNumber
      }
    }
  }
  return outBody;
}

export const submitPayment_Response = (inBody, inPanTokenized) => {
  let outBody = {    
    ResultMetaData: {},
    Payment: {
      TransactionDetail: {
        createdOn: new Date()
    }
  }
};

  if (inBody.gatewayResponse && inBody.gatewayResponse.transactionProcessingDetails && inBody.gatewayResponse.transactionProcessingDetails.transactionId){
    outBody.Payment.TransactionDetail.transactionTag = inBody.gatewayResponse.transactionProcessingDetails.transactionId;
    outBody.ResultMetaData.Times = {
      submitted: inBody.gatewayResponse.transactionProcessingDetails.transactionTimestamp,
      completed: new Date()
    } 
  }
  if (inBody.paymentReceipt && inBody.paymentReceipt.processorResponseDetails){
    let inProcResDet = inBody.paymentReceipt.processorResponseDetails;
    if (inProcResDet.responseCode){
      outBody.Payment.TransactionDetail.transactionResultCode = inProcResDet.responseCode;
    }
    if (inProcResDet.responseMessage){
      outBody.Payment.TransactionDetail.transactionResultMessage = inProcResDet.responseMessage;
    }
    if (inProcResDet.referenceNumber){
      outBody.Payment.TransactionDetail.transactionId = inProcResDet.referenceNumber;
    }
    if (inProcResDet.hostResponseMessage){
      outBody.Payment.TransactionDetail.bankMessage = inProcResDet.hostResponseMessage;
    }
    if (inProcResDet.responseCode){
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
        outBody.Payment.TransactionDetail.ValidityCheck = buildValidityCheck;    
      }
    }
    if (inProcResDet.hostResponseMessage && inProcResDet.bankAssociationDetails && inProcResDet.bankAssociationDetails.associationResponseCode) {
      outBody.message = inProcResDet.bankAssociationDetails.associationResponseCode + ' : ' + inProcResDet.hostResponseMessage;
    }
    if (inProcResDet.approvalStatus){
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
  }

  if (inBody.cardDetails && inBody.cardDetails.detailedCardProduct){
    if(inBody.cardDetails.detailedCardProduct === 'VISA'){
      outBody.Payment.TransactionDetail.cardIssuerName = 'Visa'
    }
    else if(inBody.cardDetails.detailedCardProduct === 'MASTERCARD'){
      outBody.Payment.TransactionDetail.cardIssuerName = 'Mastercard'
    }
    else if(inBody.cardDetails.detailedCardProduct === 'AMEX'){
      outBody.Payment.TransactionDetail.cardIssuerName = 'AmericanExpress'
    }
    else if(inBody.cardDetails.detailedCardProduct === 'DISCOVER'){
      outBody.Payment.TransactionDetail.cardIssuerName = 'Discover'
    }
  }

  if (inPanTokenized){
    outBody.Payment.TransactionDetail.panTokenized = inPanTokenized;
  }
  return outBody;
}