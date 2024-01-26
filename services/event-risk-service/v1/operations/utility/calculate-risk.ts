import axios from 'axios';
import pino from 'pino';
import {
  IAccertifyAddress,
  IAccertifyRequest,
  IAccertifyResponse,
  IAccountUpdate,
  IPaymentMethods,
} from '../../definitions/AccertifyEventRiskDef';
import {
  IAddress,
  ICustomer,
  IMasonHits,
  IMasonRequest,
  IMasonResponse,
  IPayments,
} from '../../definitions/MasonEventRiskDef';
import { formatPhoneNumber } from '../../shared/utils/CommonFunctions_ts';
import { downStreamErrorAxios, generalServerFault } from '../../shared/utils/ErrorHandler_ts';
import { fetchSecret } from '../../shared/utils/FetchSecrets_ts';
const logger = pino({
  level: process.env.PINO_LOG_LEVEL || 'info',
});

export var calculateRiskUtility = async (event: any) => {
  let accertifyRequest: IAccertifyRequest;

  //calls function to convert from mason co to accertify object
  try {
    accertifyRequest = mapMasonToAccertify(event);
    logger.debug({ accertifyRequest }, 'Accertify Request after mapping');
  } catch (error: any) {
    return generalServerFault(error, event);
  }

  ///////START OF ACCERTIFY CALL
  try {
    const accertifyBaseURL = process.env.ACCERTIFY_BASE_URL;
    const eventType = event.eventType;
    const accertifyEndPoint = `${accertifyBaseURL}/${eventType}`;

    const credentials: any = await fetchSecret<string>(`${process.env.STAGE}/soa/Accertify`);
    const encodedCredentials = Buffer.from(`${credentials.username}:${credentials.password}`).toString('base64');

    const accertifyHeaders = {
      'Content-Type': 'application/json',
      Authorization: `Basic ${encodedCredentials}`,
    };

    logger.trace(`Accertify Endpoint: ${accertifyEndPoint}`);
    logger.trace(`Accertify Headers: ${JSON.stringify(accertifyHeaders)}`);
    logger.trace(`Accertify Request: ${JSON.stringify(accertifyRequest)}`);

    //////Excute Call
    var accertifyResponse = await axios.post(accertifyEndPoint, accertifyRequest, { headers: accertifyHeaders });
    logger.debug({ accertifyResponse }, 'Accertify Response');
  } catch (error: any) {
    return downStreamErrorAxios(error, 'Accertify ADI Call');
  }

  //transform response from Accertify objecto Mason CO
  try {
    const response = mapAccertifyToMason(accertifyResponse.data);
    logger.debug({ response }, 'Mason Common Object Response after mapping');
    return response;
  } catch (error) {
    return generalServerFault(error, event);
  }
};

export var mapMasonToAccertify = (inBody: IMasonRequest): IAccertifyRequest => {
  const accRequest: IAccertifyRequest = {};

  function buildAddress(inAddress: IAddress, isBilling: boolean) {
    const mappedAddress: IAccertifyAddress = {};

    if (isBilling) {
      mappedAddress.addressType = 'billing';
    } else if (inAddress.HeaderInfo && inAddress.HeaderInfo.addressType) {
      mappedAddress.addressType = inAddress.HeaderInfo.addressType;
    }
    if (inAddress.HeaderInfo && (inAddress.HeaderInfo.isPrimary || inAddress.HeaderInfo.isPrimary === false)) {
      mappedAddress.primaryFlag = String(inAddress.HeaderInfo.isPrimary);
    }
    if (inAddress.PersonInfo) {
      if (inAddress.PersonInfo.firstName) {
        mappedAddress.firstName = inAddress.PersonInfo.firstName;
      }
      if (inAddress.PersonInfo.lastName) {
        mappedAddress.lastName = inAddress.PersonInfo.lastName;
      }
    }
    if (inAddress.LocationInfo) {
      if (inAddress.LocationInfo.line1) {
        mappedAddress.address1 = inAddress.LocationInfo.line1;
      }
      if (inAddress.LocationInfo.line2) {
        mappedAddress.address2 = inAddress.LocationInfo.line2;
      }
      if (inAddress.LocationInfo.city) {
        mappedAddress.city = inAddress.LocationInfo.city;
      }
      if (inAddress.LocationInfo.state) {
        mappedAddress.region = inAddress.LocationInfo.state;
      }
      if (inAddress.LocationInfo.zip) {
        mappedAddress.postCode = inAddress.LocationInfo.zip;
      }
      if (inAddress.LocationInfo.country) {
        mappedAddress.country = inAddress.LocationInfo.country;
      }
      if (inAddress.LocationInfo.emailAddress) {
        mappedAddress.email = inAddress.LocationInfo.emailAddress;
      }
      if (inAddress.LocationInfo.phoneNumber) {
        mappedAddress.phone = formatPhoneNumber(inAddress.LocationInfo.phoneNumber, true);
      }
    }
    return mappedAddress;
  }

  function buildCustomer(inCustomer: ICustomer) {
    const mappedCustomer: IAccountUpdate = {};

    if (inCustomer.CustomerInfo) {
      if (inCustomer.CustomerInfo.dob) {
        mappedCustomer.dateOfBirth = inCustomer.CustomerInfo.dob;
      }
      if (inCustomer.CustomerInfo.gender) {
        mappedCustomer.gender = inCustomer.CustomerInfo.gender;
      }
      if (inCustomer.CustomerInfo.firstName) {
        mappedCustomer.firstName = inCustomer.CustomerInfo.firstName;
      }
      if (inCustomer.CustomerInfo.lastName) {
        mappedCustomer.lastName = inCustomer.CustomerInfo.lastName;
      }
      if (inCustomer.CustomerInfo.phone) {
        mappedCustomer.phone = formatPhoneNumber(inCustomer.CustomerInfo.phone, true);
      }
      if (inCustomer.CustomerInfo.zip) {
        mappedCustomer.postCode = inCustomer.CustomerInfo.zip;
      }
      if (inCustomer.CustomerInfo.hashedPassword) {
        mappedCustomer.hashedPassword = inCustomer.CustomerInfo.hashedPassword;
      }
      if (
        inCustomer.DivisionCustomers &&
        inCustomer.DivisionCustomers[0] &&
        inCustomer.DivisionCustomers[0].DivisionCustomerInfo &&
        inCustomer.DivisionCustomers[0].DivisionCustomerInfo.webAccountId
      ) {
        mappedCustomer.accountID = inCustomer.DivisionCustomers[0].DivisionCustomerInfo.webAccountId;
      }
      if (
        inCustomer.EmailRecords &&
        inCustomer.EmailRecords[0] &&
        inCustomer.EmailRecords[0].EmailInfo &&
        inCustomer.EmailRecords[0].EmailInfo.emailAddress
      ) {
        mappedCustomer.emailAddress = inCustomer.EmailRecords[0].EmailInfo.emailAddress;
        mappedCustomer.username = inCustomer.EmailRecords[0].EmailInfo.emailAddress;
      }
    }
    if (inCustomer.BillingAddress) {
      if (mappedCustomer.addresses === undefined) {
        mappedCustomer.addresses = [];
      }
      mappedCustomer.addresses.push(buildAddress(inCustomer.BillingAddress, true));
    }
    if (inCustomer.RecipientAddresses && inCustomer.RecipientAddresses.length > 0) {
      if (mappedCustomer.addresses === undefined) {
        mappedCustomer.addresses = [];
      }
      for (let i = 0; i < inCustomer.RecipientAddresses.length; i++) {
        mappedCustomer.addresses.push(buildAddress(inCustomer.RecipientAddresses[i], false));
      }
    }

    return mappedCustomer;
  }

  function buildPayments(inPayment: IPayments) {
    const mappedPayment: IPaymentMethods = {};

    if (inPayment.PaymentInfo && inPayment.PaymentInfo.paymentType) {
      switch (inPayment.PaymentInfo.paymentType) {
        case 'Cash':
          mappedPayment.paymentType = 'cash';
          break;
        case 'Check':
          mappedPayment.paymentType = 'check';
          break;
        case 'CreditCard':
          mappedPayment.paymentType = 'creditCard';
          break;
        case 'PayPal':
          mappedPayment.paymentType = 'digitalWallet';
          break;
        case 'MasonCredit':
        case 'FigisCredit':
          mappedPayment.paymentType = 'storeCredit';
          break;
        case 'Amazon':
          mappedPayment.paymentType = 'thirdParty';
          break;
      }
      if (inPayment.PaymentDetail) {
        if (inPayment.PaymentDetail.cardIssuerId) {
          mappedPayment.cardBin = inPayment.PaymentDetail.cardIssuerId;
        }
        if (inPayment.PaymentDetail.lastDigitsOfPan) {
          mappedPayment.cardLastFour = inPayment.PaymentDetail.lastDigitsOfPan;
        }
        if (inPayment.PaymentDetail.SecureCreditCardInfo)
          if (
            inPayment.PaymentDetail.SecureCreditCardInfo.expirationDate &&
            inPayment.PaymentDetail.SecureCreditCardInfo.expirationDate.length === 4
          ) {
            mappedPayment.expirationMonth = inPayment.PaymentDetail.SecureCreditCardInfo.expirationDate.substring(0, 2);
            mappedPayment.expirationYear =
              '20' + inPayment.PaymentDetail.SecureCreditCardInfo.expirationDate.substring(2, 4);
          }
        if (inPayment.PaymentDetail.SecureCreditCardInfo!.nameOnCard) {
          mappedPayment.nameOnCreditCard = inPayment.PaymentDetail.SecureCreditCardInfo!.nameOnCard;
        }
      }
    }
    if (inPayment.TransactionDetail && inPayment.TransactionDetail.CreditCardInfo) {
      if (inPayment.TransactionDetail.CreditCardInfo.avsResponseCode) {
        mappedPayment.avsResult = inPayment.TransactionDetail.CreditCardInfo.avsResponseCode;
      }
      if (inPayment.TransactionDetail.CreditCardInfo.cvvResponseCode) {
        mappedPayment.cvvResult = inPayment.TransactionDetail.CreditCardInfo.cvvResponseCode;
      }
    }
    return mappedPayment;
  }

  if (inBody.eventSource) {
    accRequest.eventSource = inBody.eventSource;
  }
  if (inBody.divisionCode) {
    accRequest.brand = inBody.divisionCode;
  }
  if (inBody.BaseParameters) {
    if (inBody.BaseParameters.isSuccess || inBody.BaseParameters.isSuccess === false) {
      accRequest.success = String(inBody.BaseParameters.isSuccess);
    }
    if (inBody.BaseParameters.thirdPartyLogin) {
      accRequest.thirdPartyLogin = inBody.BaseParameters.thirdPartyLogin;
    }
    if (inBody.BaseParameters.loyaltyId) {
      accRequest.loyaltyId = inBody.BaseParameters.loyaltyId;
    }
    if (inBody.BaseParameters.ipAddress) {
      accRequest.ipAddress = inBody.BaseParameters.ipAddress;
    }
    if (inBody.BaseParameters.userAgent) {
      accRequest.userAgent = inBody.BaseParameters.userAgent;
    }
    if (inBody.BaseParameters.deviceTransactionId) {
      accRequest.deviceTransactionID = inBody.BaseParameters.deviceTransactionId;
    }
    if (inBody.BaseParameters.ubaId) {
      accRequest.ubaID = inBody.BaseParameters.ubaId;
    }
    if (inBody.BaseParameters.ubaEvents) {
      accRequest.ubaEvents = inBody.BaseParameters.ubaEvents;
    }
    if (inBody.BaseParameters.ubaSessionId) {
      accRequest.ubaSessionId = inBody.BaseParameters.ubaSessionId;
    }
    if (inBody.BaseParameters.accountStatus) {
      accRequest.accountStatus = inBody.BaseParameters.accountStatus;
    }
    if (inBody.BaseParameters.password) {
      accRequest.password = inBody.BaseParameters.password;
    }
    if (inBody.BaseParameters.hashedPassword) {
      accRequest.hashedPassword = inBody.BaseParameters.hashedPassword;
    }
    if (inBody.BaseParameters.previousHashedPassword) {
      accRequest.previousHashedPassword = inBody.BaseParameters.previousHashedPassword;
    }
    if (inBody.BaseParameters.updatedHashedPassword) {
      accRequest.updatedHashedPassword = inBody.BaseParameters.updatedHashedPassword;
    }
    if (inBody.BaseParameters.lastPasswordChangeDate) {
      accRequest.lastPasswordChangeDate = inBody.BaseParameters.lastPasswordChangeDate;
    }
    if (inBody.BaseParameters.returnScore || inBody.BaseParameters.returnScore === false) {
      accRequest.returnScore = inBody.BaseParameters.returnScore;
    } else {
      accRequest.returnScore = true;
    }
    if (inBody.BaseParameters.latitude) {
      accRequest.latitude = inBody.BaseParameters.latitude;
    }
    if (inBody.BaseParameters.longitude) {
      accRequest.longitude = inBody.BaseParameters.longitude;
    }
    if (inBody.BaseParameters.pageId) {
      accRequest.pageID = inBody.BaseParameters.pageId;
    }
    if (inBody.BaseParameters.failureCode) {
      accRequest.failureCode = inBody.BaseParameters.failureCode;
    }
    if (inBody.BaseParameters.updateTrigger) {
      accRequest.updateTrigger = inBody.BaseParameters.updateTrigger;
    }
    if (inBody.BaseParameters.transactionId) {
      accRequest.transactionID = inBody.BaseParameters.transactionId;
    }
    if (inBody.BaseParameters.currencyCode) {
      accRequest.currencyCode = inBody.BaseParameters.currencyCode;
    }
    if (inBody.BaseParameters.paymentAmount || inBody.BaseParameters.paymentAmount === 0) {
      accRequest.paymentAmount = inBody.BaseParameters.paymentAmount;
    }
    if (inBody.BaseParameters.chargebackAmount || inBody.BaseParameters.chargebackAmount === 0) {
      accRequest.chargebackAmount = inBody.BaseParameters.chargebackAmount;
    }
    if (inBody.BaseParameters.verificationType) {
      accRequest.verificationType = inBody.BaseParameters.verificationType;
    }
    if (inBody.BaseParameters.verificationStatus) {
      accRequest.verificationStatus = inBody.BaseParameters.verificationStatus;
    }
    if (inBody.BaseParameters.verificationAttempts) {
      accRequest.verificationAttempts = inBody.BaseParameters.verificationAttempts;
    }
    if (inBody.BaseParameters.updateEventId) {
      accRequest.updateEventID = inBody.BaseParameters.updateEventId;
    }

    if (inBody.eventType === 'accountUpdate') {
      if (inBody.Customer) {
        accRequest.updatedValues = buildCustomer(inBody.Customer);
      }
      if (inBody.PreviousCustomer) {
        accRequest.previousValues = buildCustomer(inBody.PreviousCustomer);
      }
      /* web account ID needs to be added to the root Accertify object
       * and removed from the updatedValues
       */
      if (accRequest.updatedValues.accountID) {
        accRequest.accountID = accRequest.updatedValues.accountID;
        delete accRequest.updatedValues.accountID;
      }
      /* email address and username needs to be added to the root Accertify object.
       * And removed from the updatedValues when it's not actually being updated
       */
      if (accRequest.updatedValues.emailAddress) {
        accRequest.emailAddress = accRequest.updatedValues.emailAddress;
        accRequest.username = accRequest.updatedValues.username;
        if (!accRequest.previousValues || !accRequest.previousValues.emailAddress) {
          delete accRequest.updatedValues.emailAddress;
        }
        if (!accRequest.previousValues || !accRequest.previousValues.username) {
          delete accRequest.updatedValues.username;
        }
      }
    } else {
      if (inBody.Customer && inBody.Customer!.CustomerInfo) {
        if (inBody.Customer.CustomerInfo.dob) {
          accRequest.dateOfBirth = inBody.Customer.CustomerInfo.dob;
        }
        if (inBody.Customer.CustomerInfo.gender) {
          accRequest.gender = inBody.Customer.CustomerInfo.gender;
        }
        if (inBody.Customer.CustomerInfo.firstName) {
          accRequest.firstName = inBody.Customer.CustomerInfo.firstName;
        }
        if (inBody.Customer.CustomerInfo.lastName) {
          accRequest.lastName = inBody.Customer.CustomerInfo.lastName;
        }
        if (inBody.Customer.CustomerInfo.phone) {
          accRequest.phone = formatPhoneNumber(inBody.Customer.CustomerInfo.phone, true);
        }
        if (inBody.Customer.CustomerInfo.zip) {
          accRequest.postCode = inBody.Customer.CustomerInfo.zip;
        }
        if (inBody.Customer.CustomerInfo.hashedPassword) {
          accRequest.hashedPassword = inBody.Customer.CustomerInfo.hashedPassword;
        }
        if (
          inBody.Customer.DivisionCustomers &&
          inBody.Customer.DivisionCustomers[0] &&
          inBody.Customer.DivisionCustomers[0].DivisionCustomerInfo &&
          inBody.Customer.DivisionCustomers[0].DivisionCustomerInfo.webAccountId
        ) {
          accRequest.accountID = inBody.Customer.DivisionCustomers[0].DivisionCustomerInfo.webAccountId;
        }
        if (
          inBody.Customer.EmailRecords &&
          inBody.Customer.EmailRecords[0] &&
          inBody.Customer.EmailRecords[0].EmailInfo &&
          inBody.Customer.EmailRecords[0].EmailInfo.emailAddress
        ) {
          accRequest.emailAddress = inBody.Customer.EmailRecords[0].EmailInfo.emailAddress;
          accRequest.username = inBody.Customer.EmailRecords[0].EmailInfo.emailAddress;
        }
      }
      if (inBody.Customer!.BillingAddress) {
        if (accRequest.addresses === undefined) {
          accRequest.addresses = [];
        }
        accRequest.addresses.push(buildAddress(inBody.Customer!.BillingAddress, true));
      }
      if (inBody.Customer!.RecipientAddresses && inBody.Customer!.RecipientAddresses.length > 0) {
        if (accRequest.addresses === undefined) {
          accRequest.addresses = [];
        }
        for (var i = 0; i < inBody.Customer!.RecipientAddresses.length; i++) {
          accRequest.addresses.push(buildAddress(inBody.Customer!.RecipientAddresses[i], false));
        }
      }
    }
    if (inBody.Payments && inBody.Payments.length > 0) {
      accRequest.paymentMethods = [];
      for (var i = 0; i < inBody.Payments.length; i++) {
        accRequest.paymentMethods.push(buildPayments(inBody.Payments[i]));
      }
    }
    if (inBody.PreviousPayments && inBody.PreviousPayments.length > 0) {
      accRequest.previousValues!.paymentMethods = [];
      for (var i = 0; i < inBody.PreviousPayments.length; i++) {
        accRequest.previousValues!.paymentMethods.push(buildPayments(inBody.PreviousPayments[i]));
      }
    }
  }

  return accRequest;
};

export var mapAccertifyToMason = (inBody: IAccertifyResponse): IMasonResponse => {
  const convertMillisToISODate = (inTime) => {
    return new Date(Number(inTime)).toISOString();
  };

  const masonResponse: IMasonResponse = {};
  masonResponse.RiskResult = {};

  if (inBody.status && inBody.status === true) {
    masonResponse.code = 'OK';
  }
  if (inBody.eventID) {
    masonResponse.RiskResult.eventId = inBody.eventID;
  }
  if (inBody.results && inBody.results.riskScore) {
    if (inBody.results.riskScore.score) {
      masonResponse.RiskResult.score = inBody.results.riskScore.score;
    }
    if (inBody.results.riskScore.recommendationCode) {
      masonResponse.RiskResult.recommendationCode = inBody.results.riskScore.recommendationCode;
    }
    if (inBody.results.riskScore.recommendationDetail) {
      masonResponse.RiskResult.recommendationDetail = inBody.results.riskScore.recommendationDetail;
    }
    if (
      inBody.results.riskScore.reasonCodes &&
      inBody.results.riskScore.reasonCodes.trustFactors &&
      inBody.results.riskScore.reasonCodes.trustFactors.length > 0
    ) {
      masonResponse.RiskResult.TrustFactors = inBody.results.riskScore.reasonCodes.trustFactors;
    }
    if (
      inBody.results.riskScore.reasonCodes &&
      inBody.results.riskScore.reasonCodes.riskFactors &&
      inBody.results.riskScore.reasonCodes.riskFactors.length > 0
    ) {
      masonResponse.RiskResult.RiskFactors = inBody.results.riskScore.reasonCodes.riskFactors;
    }
    if (inBody.results.riskScore.insights && inBody.results.riskScore.insights.length > 0) {
      masonResponse.RiskResult.Insights = inBody.results.riskScore.insights;
    }
  }
  if (inBody.results && inBody.results.listHits) {
    if (inBody.results.listHits.negativeValues) {
      masonResponse.RiskResult.NegativeHits = [];
      for (let i = 0; i < inBody.results.listHits.negativeValues.length; i++) {
        const inNegativeValues = inBody.results.listHits.negativeValues[i];
        const outNegativeValues: IMasonHits = {};

        if (inNegativeValues.fieldName) {
          outNegativeValues.name = inNegativeValues.fieldName;
        }
        if (inNegativeValues.type) {
          outNegativeValues.type = inNegativeValues.type;
        }
        if (inNegativeValues.value) {
          outNegativeValues.value = inNegativeValues.value;
        }
        if (inNegativeValues.created) {
          outNegativeValues.createdOn = convertMillisToISODate(inNegativeValues.created);
        }
        if (inNegativeValues.lastSeen) {
          outNegativeValues.lastSeenOn = convertMillisToISODate(inNegativeValues.lastSeen);
        }
        if (inNegativeValues.timesHit) {
          outNegativeValues.timesHit = inNegativeValues.timesHit;
        }
        masonResponse.RiskResult.NegativeHits.push(outNegativeValues);
      }
    }
    if (inBody.results.listHits.positiveValues) {
      masonResponse.RiskResult.PositiveHits = [];
      for (let j = 0; j < inBody.results.listHits.positiveValues.length; j++) {
        const inPostiveValues = inBody.results.listHits.positiveValues[j];
        const outPositiveValues: IMasonHits = {};

        if (inPostiveValues.fieldName) {
          outPositiveValues.name = inPostiveValues.fieldName;
        }
        if (inPostiveValues.type) {
          outPositiveValues.type = inPostiveValues.type;
        }
        if (inPostiveValues.value) {
          outPositiveValues.value = inPostiveValues.value;
        }
        if (inPostiveValues.created) {
          outPositiveValues.createdOn = convertMillisToISODate(inPostiveValues.created);
        }
        if (inPostiveValues.lastSeen) {
          outPositiveValues.lastSeenOn = convertMillisToISODate(inPostiveValues.lastSeen);
        }
        if (inPostiveValues.timesHit) {
          outPositiveValues.timesHit = inPostiveValues.timesHit;
        }
        masonResponse.RiskResult.PositiveHits.push(outPositiveValues);
      }
    }
  }

  if (inBody.eventDetails && inBody.eventDetails.deviceDetails) {
    const deviceDetail: any = {};

    if (inBody.eventDetails.deviceDetails.deviceIDConfidence) {
      deviceDetail.deviceIdConfidence = String(inBody.eventDetails.deviceDetails.deviceIDConfidence);
    }
    if (inBody.eventDetails.deviceDetails.deviceIDFirstSeen) {
      deviceDetail.deviceIdFirstSeenOn = convertMillisToISODate(inBody.eventDetails.deviceDetails.deviceIDFirstSeen);
    }
    if (inBody.eventDetails.deviceDetails.deviceID) {
      deviceDetail.deviceId = inBody.eventDetails.deviceDetails.deviceID;
    }
    if (inBody.eventDetails.deviceDetails.deviceIDNew) {
      deviceDetail.isNewDeviceId = inBody.eventDetails.deviceDetails.deviceIDNew;
    }
    if (inBody.eventDetails.deviceDetails.deviceIDTimesSeen) {
      deviceDetail.deviceIdTimesSeen = inBody.eventDetails.deviceDetails.deviceIDTimesSeen;
    }
    if (Object.keys(deviceDetail).length) {
      masonResponse.RiskResult.DeviceDetail = deviceDetail;
    }
  }
  if (inBody.messages) {
    masonResponse.RiskResult.Messages = [];

    // function used to append messages to mason message array
    function createMessages(messageArray: any, newMessage: any, severity: any) {
      for (let i = 0; i < newMessage.length; i++) {
        messageArray.push({
          severity: severity,
          text: newMessage[i],
        });
      }
    }

    if (inBody.messages.error && inBody.messages.error.length > 0) {
      createMessages(masonResponse.RiskResult.Messages, inBody.messages.error, 'error');
      masonResponse.debugMessage = inBody.messages.error[0]; // to help troubleshoot upstream
    }
    if (inBody.messages.warning && inBody.messages.warning.length > 0) {
      createMessages(masonResponse.RiskResult.Messages, inBody.messages.warning, 'warning');
    }
    if (inBody.messages.info && inBody.messages.info.length > 0) {
      createMessages(masonResponse.RiskResult.Messages, inBody.messages.info, 'info');
    }
  }
  if (inBody.status && inBody.status === true && masonResponse.RiskResult) {
    masonResponse.RiskResult.nextAction = 'ProceedNormally';
  }
  return masonResponse;
};
