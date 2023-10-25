import pino from 'pino';
import { calculateRiskEntity } from "../entity/calculate-risk";
import { IMasonRequest, IAddress, IPayments, IMasonResponse } from "../../Definitions/MasonEventRiskDef";
import { IOracleRequest, IOracleResponse } from "../../Definitions/OracleEventRiskDef";

const logger = pino();

export const calculateRiskTask = async (event : any) => {
	try {

    //calls function to convert from oracle to mason common object
    const reqBody = mapOracleToMason(event.body);

		//calls the calculateRiskEntity service passing in the Mason CO
    const resBody = await calculateRiskEntity(reqBody)
    var parsedResponse = JSON.parse(JSON.stringify(resBody));

    //Returns back to the original caller with a oracle object
    if(parsedResponse.code !== "OK"){
      return parsedResponse;
    } 
    return mapMasonToOracle(parsedResponse);
	} 
	catch (error) {
    //generic error handler
    return {
      statusCode: 500,
      message: "Error in oraclecommerce-event-risk-task /calculate-risk",
      errorName: error.name,
      errorMessage: error.message,
    };
  }
}

 /**
     * maps the oracle object to mason common object
     * @param inBody the oracle object
     * @returns mason common object
     */
export const mapOracleToMason = (inBody: IOracleRequest): IMasonRequest => {

  /**
   * builds mapped address object
   * @param addressBody 
   * @returns mapped address body from oracle object to mason co
   */
  function buildAddress(addressBody: any): IAddress{
    const mappedAddress : IAddress = {
      HeaderInfo: {},
      PersonInfo: {},
      LocationInfo: {}
    };

    if(addressBody.addrType){
      mappedAddress.HeaderInfo!.addressType = addressBody.addrType;
    }
    if(addressBody.isPrimary || addressBody.isPrimary === false){
      mappedAddress.HeaderInfo!.isPrimary = addressBody.isPrimary;
    }
    if(addressBody.firstName){
      mappedAddress.PersonInfo!.firstName = addressBody.firstName;
    }
    if(addressBody.lastName){
      mappedAddress.PersonInfo!.lastName = addressBody.lastName;
    }
    if(addressBody.addr1){
      mappedAddress.LocationInfo!.line1 = addressBody.addr1;
    }
    if(addressBody.addr2){
      mappedAddress.LocationInfo!.line2 = addressBody.addr2;
    }
    if(addressBody.city){
      mappedAddress.LocationInfo!.city = addressBody.city;
    }
    if(addressBody.state){
      mappedAddress.LocationInfo!.state = addressBody.state;
    }
    if(addressBody.zip){
      mappedAddress.LocationInfo!.zip = addressBody.zip;
    }
    if(addressBody.country){
      mappedAddress.LocationInfo!.country = addressBody.country;
    }
    if(addressBody.email){
      mappedAddress.LocationInfo!.emailAddress = addressBody.email;
    }
    if(addressBody.phone){
      mappedAddress.LocationInfo!.phoneNumber = addressBody.phone;
    }
    return mappedAddress
  }

  /**
   * Builds a mapped payment object
   * @param paymentBody 
   * @returns payment object that has been mapped from oracle object to mason co
   */
  function buildPayment(paymentBody: any): IPayments{
    const mappedPayment: IPayments = {
      PaymentInfo: {}
    };

    if(paymentBody.paymentType){
      switch(paymentBody.paymentType) {
        case 'CC':
          mappedPayment.PaymentInfo!.paymentType = 'CreditCard';
          mappedPayment.PaymentDetail = {
            SecureCreditCardInfo: {}
          };
          if (paymentBody.panTokenized) {
            mappedPayment.PaymentDetail.SecureCreditCardInfo!.panTokenized = paymentBody.panTokenized;
          }
          if (paymentBody.expirationDate) {
            mappedPayment.PaymentDetail.SecureCreditCardInfo!.expirationDate = paymentBody.expirationDate;
          }
          if (paymentBody.nameOnCard) {
            mappedPayment.PaymentDetail.SecureCreditCardInfo!.nameOnCard = paymentBody.nameOnCard;
          }
          if (paymentBody.cardIssuerId) {
            mappedPayment.PaymentDetail.cardIssuerId = paymentBody.cardIssuerId;
          }
          if (paymentBody.lastDigitsOfPan) {
            mappedPayment.PaymentDetail.lastDigitsOfPan = paymentBody.lastDigitsOfPan;
          }
          mappedPayment.TransactionDetail = {
            CreditCardInfo: {}
          };
          if (paymentBody.avsResponseCode) {
            mappedPayment.TransactionDetail.CreditCardInfo!.avsResponseCode = paymentBody.avsResponseCode;
          }
          if (paymentBody.cvvResponseCode) {
            mappedPayment.TransactionDetail.CreditCardInfo!.cvvResponseCode = paymentBody.cvvResponseCode;
          }
          break;
        case 'MC':
          mappedPayment.PaymentInfo!.paymentType = 'MasonCredit';
          break;
        case 'P3':
          mappedPayment.PaymentInfo!.paymentType = 'FigisCredit';
          break;
        case 'CA':
          mappedPayment.PaymentInfo!.paymentType = 'Cash';
          break;
        case 'CK':
          mappedPayment.PaymentInfo!.paymentType = 'Check';
          break;
        case 'PP':
          mappedPayment.PaymentInfo!.paymentType = 'PayPal';
          break;
      }
    }
    return mappedPayment;
  }

  //beginning of request transformation
  const masonRequest : IMasonRequest = {
    Customer: {
      CustomerInfo: {}
    }
  }

  if(inBody.eventType){
    masonRequest.eventType = inBody.eventType;
  }
  if(inBody.eventSource){
    masonRequest.eventSource = inBody.eventSource;
  }
  if(inBody.divisionCode){
    masonRequest.divisionCode = inBody.divisionCode;
  }
  if(inBody.Parameters){
    masonRequest.BaseParameters = {};

    if(inBody.Parameters.isSuccess || inBody.Parameters.isSuccess === false){
      masonRequest.BaseParameters.isSuccess = inBody.Parameters.isSuccess;
    }
    if(inBody.Parameters.thirdPartyLogin){
      masonRequest.BaseParameters.thirdPartyLogin = inBody.Parameters.thirdPartyLogin;
    }
    if(inBody.Parameters.loyaltyId){
      masonRequest.BaseParameters.loyaltyId = inBody.Parameters.loyaltyId;
    }
    if(inBody.Parameters.ipAddress){
      masonRequest.BaseParameters.ipAddress = inBody.Parameters.ipAddress;
    }
    if(inBody.Parameters.userAgent){
      masonRequest.BaseParameters.userAgent = inBody.Parameters.userAgent;
    }
    if(inBody.Parameters.deviceTransactionId){
      masonRequest.BaseParameters.deviceTransactionId = inBody.Parameters.deviceTransactionId;
    }
    if(inBody.Parameters.ubaId){
      masonRequest.BaseParameters.ubaId = inBody.Parameters.ubaId;
    }
    if(inBody.Parameters.ubaEvents){
      masonRequest.BaseParameters.ubaEvents = inBody.Parameters.ubaEvents;
    }
    if(inBody.Parameters.ubaSessionId){
      masonRequest.BaseParameters.ubaSessionId = inBody.Parameters.ubaSessionId;
    }
    if(inBody.Parameters.accountStatus){
      masonRequest.BaseParameters.accountStatus = inBody.Parameters.accountStatus;
    }
    if(inBody.Parameters.password){
      masonRequest.BaseParameters.password = inBody.Parameters.password;
    }
    if(inBody.Parameters.hashedPassword){
      masonRequest.BaseParameters.hashedPassword = inBody.Parameters.hashedPassword;
    }
    if(inBody.eventType === 'accountUpdate'){
      masonRequest.PreviousCustomer = {
        CustomerInfo: {}
      };

      if(inBody.Parameters.previousHashedPassword){
        masonRequest.PreviousCustomer.CustomerInfo!.hashedPassword = inBody.Parameters.previousHashedPassword;
      }
      if(inBody.Parameters.updatedHashedPassword){
        masonRequest.BaseParameters.hashedPassword = inBody.Parameters.updatedHashedPassword;
      }
      if(inBody.Parameters.previousDob){
        masonRequest.PreviousCustomer.CustomerInfo!.dob = inBody.Parameters.previousDob;
      }
      if(inBody.Parameters.previousGender){
        masonRequest.PreviousCustomer.CustomerInfo!.gender = inBody.Parameters.previousGender;
      }
      if(inBody.Parameters.previousFirstName){
        masonRequest.PreviousCustomer.CustomerInfo!.firstName = inBody.Parameters.previousFirstName;
      }
      if(inBody.Parameters.previousLastName){
        masonRequest.PreviousCustomer.CustomerInfo!.lastName = inBody.Parameters.previousLastName;
      }
      if(inBody.Parameters.previousPhone){
        masonRequest.PreviousCustomer.CustomerInfo!.phone = inBody.Parameters.previousPhone;
      }
      if(inBody.Parameters.previousZip){
        masonRequest.PreviousCustomer.CustomerInfo!.zip = inBody.Parameters.previousZip;
      }
      if(inBody.Parameters.previousEmailAddress){
        masonRequest.PreviousCustomer.EmailRecords = [{
          EmailInfo: {
            emailAddress: inBody.Parameters.previousEmailAddress
          }
        }]
      }
    }
    else{
      if(inBody.Parameters.previousHashedPassword){
        masonRequest.BaseParameters.previousHashedPassword = inBody.Parameters.previousHashedPassword;
      }
      if(inBody.Parameters.updatedHashedPassword){
        masonRequest.BaseParameters.updatedHashedPassword = inBody.Parameters.updatedHashedPassword;
      }
    }
    if(inBody.Parameters.lastPasswordChangeDate){
      masonRequest.BaseParameters.lastPasswordChangeDate = inBody.Parameters.lastPasswordChangeDate;
    }
    if(inBody.Parameters.returnScore !== undefined && inBody.Parameters.returnScore === false){
      masonRequest.BaseParameters.returnScore = inBody.Parameters.returnScore;
    }else{
      masonRequest.BaseParameters.returnScore = true;
    }
    if(inBody.Parameters.latitude){
      masonRequest.BaseParameters.latitude = inBody.Parameters.latitude;
    }
    if(inBody.Parameters.longitude){
      masonRequest.BaseParameters.longitude = inBody.Parameters.longitude;
    }
    if(inBody.Parameters.pageId){
      masonRequest.BaseParameters.pageId = inBody.Parameters.pageId;
    }
    if(inBody.Parameters.failureCode){
      masonRequest.BaseParameters.failureCode = inBody.Parameters.failureCode;
    }
    if(inBody.Parameters.updateTrigger){
      masonRequest.BaseParameters.updateTrigger = inBody.Parameters.updateTrigger;
    }
    if(inBody.Parameters.transactionId){
      masonRequest.BaseParameters.transactionId = inBody.Parameters.transactionId;
    }
    if(inBody.Parameters.currencyCode){
      masonRequest.BaseParameters.currencyCode = inBody.Parameters.currencyCode;
    }
    if(inBody.Parameters.verificationType){
      masonRequest.BaseParameters.verificationType = inBody.Parameters.verificationType;
    }
    if(inBody.Parameters.verificationStatus){
      masonRequest.BaseParameters.verificationStatus = inBody.Parameters.verificationStatus;
    }
    if(inBody.Parameters.verificationAttempts){
      masonRequest.BaseParameters.verificationAttempts = inBody.Parameters.verificationAttempts;
    }
    if(inBody.Parameters.updateEventId){
      masonRequest.BaseParameters.updateEventId = inBody.Parameters.updateEventId;
    }
    if(inBody.Parameters.paymentAmount){
      masonRequest.BaseParameters.paymentAmount = inBody.Parameters.paymentAmount;
    }
    if(inBody.Parameters.dob){
      masonRequest.Customer!.CustomerInfo!.dob = inBody.Parameters.dob;
    }
    if(inBody.Parameters.gender){
      masonRequest.Customer!.CustomerInfo!.gender = inBody.Parameters.gender;
    }
    if(inBody.Parameters.firstName){
      masonRequest.Customer!.CustomerInfo!.firstName = inBody.Parameters.firstName;
    }
    if(inBody.Parameters.lastName){
      masonRequest.Customer!.CustomerInfo!.lastName = inBody.Parameters.lastName;
    }
    if(inBody.Parameters.phone){
      masonRequest.Customer!.CustomerInfo!.phone = inBody.Parameters.phone;
    }
    if(inBody.Parameters.zip){
      masonRequest.Customer!.CustomerInfo!.zip = inBody.Parameters.zip;
    }
    if(inBody.Parameters.webAccountId){
      masonRequest.Customer!.DivisionCustomers = [{
        DivisionCustomerInfo: {
          webAccountId: inBody.Parameters.webAccountId
        }
      }]
    }
    if(inBody.Parameters.emailAddress){
      masonRequest.Customer!.EmailRecords = [{
        EmailInfo: {
          emailAddress: inBody.Parameters.emailAddress
        }
      }]
    }

    //address
    if(inBody.Parameters.Addresses && inBody.Parameters.Addresses.length > 0){
      masonRequest.Customer!.RecipientAddresses = [];

      for(var i = 0; i < inBody.Parameters.Addresses.length; i++){
        var inAddress = inBody.Parameters.Addresses[i];

        var mappedAddress = buildAddress(inAddress);

        if(mappedAddress.HeaderInfo && mappedAddress.HeaderInfo.addressType && mappedAddress.HeaderInfo.addressType === 'billing'){
          masonRequest.Customer!.BillingAddress = mappedAddress;
        }
        else{
          masonRequest.Customer!.RecipientAddresses.push(mappedAddress);
        }  
      }
    }
    //previous address
    if(inBody.Parameters.PreviousAddresses && inBody.Parameters.PreviousAddresses.length > 0){
      masonRequest.PreviousCustomer!.RecipientAddresses = [];

      for(var i = 0; i < inBody.Parameters.PreviousAddresses.length; i++){
        var inPreviousAddress = inBody.Parameters.PreviousAddresses[i];

        var mappedPreviousAddress = buildAddress(inPreviousAddress);

        if(mappedPreviousAddress.HeaderInfo && mappedPreviousAddress.HeaderInfo.addressType && mappedPreviousAddress.HeaderInfo.addressType === 'billing'){
          masonRequest.PreviousCustomer!.BillingAddress = mappedPreviousAddress;
        }
        else{
          masonRequest.PreviousCustomer!.RecipientAddresses.push(mappedPreviousAddress);
        }  
      }
    }
    //payment
    if(inBody.Parameters.PaymentMethods && inBody.Parameters.PaymentMethods.length > 0){
      masonRequest.Payments = [];

      for(var i = 0; i < inBody.Parameters.PaymentMethods.length; i++){
        masonRequest.Payments.push(buildPayment(inBody.Parameters.PaymentMethods[i]));

      }
    }

    //previous payment
    if(inBody.Parameters.PreviousPaymentMethods && inBody.Parameters.PreviousPaymentMethods.length > 0){
      masonRequest.PreviousPayments = [];

      for(var i = 0; i < inBody.Parameters.PreviousPaymentMethods.length; i++){
        var inPreviousPayment = inBody.Parameters.PreviousPaymentMethods[i];

        var mappedPreviousPayments = buildPayment(inPreviousPayment);

        masonRequest.PreviousPayments.push(mappedPreviousPayments);
      }
    }
  }
  return masonRequest;
}

/**
 * transform mason co to oracle object
 * @param inBody 
 * @returns a mapped oracle object from a mason co
 */
export const mapMasonToOracle = (inBody: IMasonResponse): IOracleResponse => {
  const oracleResponse: IOracleResponse = {};
  
  if(inBody.code){
    oracleResponse.code = inBody.code;
  }
  if(inBody.message){
    oracleResponse.message = inBody.message;
  }
  if(inBody.debugMessage){
    oracleResponse.debugMessage = inBody.debugMessage;
  }
  if(inBody.RiskResult){
    if(inBody.RiskResult.eventId){
      oracleResponse.eventId = inBody.RiskResult.eventId;
    }
    if(inBody.RiskResult.score){
      oracleResponse.score = inBody.RiskResult.score;
    }
    if(inBody.RiskResult.recommendationCode){
      oracleResponse.recommendationCode = inBody.RiskResult.recommendationCode;
    }
    if(inBody.RiskResult.recommendationDetail){
      oracleResponse.recommendationDetail = inBody.RiskResult.recommendationDetail;
    }
    if(inBody.RiskResult.nextAction){
      oracleResponse.nextAction = inBody.RiskResult.nextAction;
    }
    if(inBody.RiskResult.TrustFactors && inBody.RiskResult.TrustFactors.length > 0){
      oracleResponse.trustFactors = inBody.RiskResult.TrustFactors;
    }
    if(inBody.RiskResult.RiskFactors && inBody.RiskResult.RiskFactors.length > 0){
      oracleResponse.riskFactors = inBody.RiskResult.RiskFactors;
    }
    if(inBody.RiskResult.Insights && inBody.RiskResult.Insights.length > 0){
      oracleResponse.insights = inBody.RiskResult.Insights;
    }
    if(inBody.RiskResult.DeviceDetail){
      oracleResponse.DeviceDetail = {};

      if(inBody.RiskResult.DeviceDetail.deviceIdConfidence){
        oracleResponse.DeviceDetail.deviceIdConfidence = inBody.RiskResult.DeviceDetail.deviceIdConfidence;
      }
      //need to convert milliseconds since epoch to date
      if(inBody.RiskResult.DeviceDetail.deviceIdFirstSeenOn){
        oracleResponse.DeviceDetail.deviceIdFirstSeenOn = inBody.RiskResult.DeviceDetail.deviceIdFirstSeenOn;
      }
      if(inBody.RiskResult.DeviceDetail.deviceId){
        oracleResponse.DeviceDetail.deviceId = inBody.RiskResult.DeviceDetail.deviceId;
      }
      if(inBody.RiskResult.DeviceDetail.isNewDeviceId || inBody.RiskResult.DeviceDetail.isNewDeviceId === false){
        oracleResponse.DeviceDetail.isNewDeviceId = inBody.RiskResult.DeviceDetail.isNewDeviceId;
      }
      if(inBody.RiskResult.DeviceDetail.deviceIdTimesSeen){
        oracleResponse.DeviceDetail.deviceIdTimesSeen = inBody.RiskResult.DeviceDetail.deviceIdTimesSeen;
      }
    }
  }
  return oracleResponse;
}