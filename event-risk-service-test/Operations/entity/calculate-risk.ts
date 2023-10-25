import pino from 'pino';
import { calculateRiskUtility } from "../utility/calculate-risk";
import { IMasonRequest } from '../../Definitions/MasonEventRiskDef';
const logger = pino();

export const calculateRiskEntity= async (event: IMasonRequest) => {
	try {

    /**
     * Validates the request object.
     * @param inBody the Mason CO to be validated
     * @returns the validation body, to determine whether it's a valid call or not.
     */
    const validateRequest = (inBody: any) => {
      const errorBody = {
        code: 'OK',
        validationMessage: " "
      };

      if(!inBody.eventType){
        errorBody.validationMessage += "An eventType must exist."
      }
      if(inBody.eventType && !(/^(login|logout|accountCreate|accountUpdate|passwordForgotUpdate|passwordUpdate|payment|verification)$/g.test(inBody.eventType))){
        errorBody.validationMessage += "Eventtype " + inBody.eventType + " is not valid."
      }
      if(!inBody.eventSource){
        errorBody.validationMessage += "Eventsource must exist."
      }
      if(inBody.eventType === "login" && !inBody.BaseParameters.isSuccess && inBody.BaseParameters.isSuccess !== false){
        errorBody.validationMessage += "isSuccess must exist when eventType is login."
      }
      if(inBody.eventType === "logout"){
        if(!inBody.Customer || 
          !inBody.Customer.DivisionCustomers || 
          !inBody.Customer.DivisionCustomers[0] ||
          !inBody.Customer.DivisionCustomers[0].DivisionCustomerInfo ||
          !inBody.Customer.DivisionCustomers[0].DivisionCustomerInfo.webAccountId){
            errorBody.validationMessage += "webAccountId must exist when eventType is logout."
        }
      }
      if(inBody.eventType === "accountCreate" && !inBody.BaseParameters.isSuccess && inBody.BaseParameters.isSuccess !== false){
        errorBody.validationMessage += "isSuccess must exist when eventType is accountCreate."
      }
      if(inBody.eventType === "accountUpdate"){
        if(!inBody.Customer || 
          !inBody.Customer.DivisionCustomers || 
          !inBody.Customer.DivisionCustomers[0] ||
          !inBody.Customer.DivisionCustomers[0].DivisionCustomerInfo ||
          !inBody.Customer.DivisionCustomers[0].DivisionCustomerInfo.webAccountId){
            errorBody.validationMessage += "webAccountId must exist when eventType is accountUpdate."
        }
      }
      if(inBody.eventType === "passwordForgotUpdate"){
        if(!inBody.Customer || 
          !inBody.Customer.DivisionCustomers || 
          !inBody.Customer.DivisionCustomers[0] ||
          !inBody.Customer.DivisionCustomers[0].DivisionCustomerInfo ||
          !inBody.Customer.DivisionCustomers[0].DivisionCustomerInfo.webAccountId){
            errorBody.validationMessage += "webAccountId must exist when eventType is passwordForgotUpdate."
        }
        if(!inBody.BaseParameters.updateTrigger){
          errorBody.validationMessage += "updateTrigger must exist when eventType is passwordForgotUpdate.";
        }
      }
      if(inBody.eventType === "payment"){
        if(!inBody.BaseParameters.transactionId){
          errorBody.validationMessage += "transactionId must exist when eventType is payment."
        }
        if(!inBody.BaseParameters.paymentAmount && inBody.BaseParameters.paymentAmount !== 0){
          errorBody.validationMessage += "paymentAmount must exist when eventType is payment."
        }
        if(!inBody.BaseParameters.currencyCode){
          errorBody.validationMessage += "currencyCode must exist when eventType is payment."
        }
        if(!inBody.BaseParameters.isSuccess && !inBody.BaseParameters.isSuccess && inBody.BaseParameters.isSuccess !== false){
          errorBody.validationMessage += "isSuccess must exist when eventType is payment."
        }
      }
      if(inBody.eventType === "verification"){
        if(!inBody.Customer || 
          !inBody.Customer.DivisionCustomers || 
          !inBody.Customer.DivisionCustomers[0] ||
          !inBody.Customer.DivisionCustomers[0].DivisionCustomerInfo ||
          !inBody.Customer.DivisionCustomers[0].DivisionCustomerInfo.webAccountId){
            errorBody.validationMessage += "webAccountId must exist when eventType is verification."
        }
        if(!inBody.BaseParameters.updateEventId){
          errorBody.validationMessage += "updateEventId must exist when eventType is payment."
        }
        if(!inBody.BaseParameters.verificationType){
          errorBody.validationMessage += "verificationType must exist when eventType is verification."
        }
        if(inBody.BaseParameters.verificationType && !(/^(appAuthenticator|appPush|captcha|email|kbAnswers|other|phoneCall|securityQuestions|Sms)$/g.test(inBody.BaseParameters.verificationType))){
          errorBody.validationMessage += "VerificationType " + inBody.BaseParameters.verificationType + " is not valid."
        }
        if(!inBody.BaseParameters.verificationStatus){
          errorBody.validationMessage += "verificationStatus must exist when eventType is verification."
        }
        if(inBody.BaseParameters.verificationStatus && !(/^(abandoned|expired|fail|success)$/g.test(inBody.BaseParameters.verificationStatus))){
          errorBody.validationMessage += "VerificationStatus " + inBody.BaseParameters.verificationStatus + " is not valid."
        }
      }

      if(errorBody.validationMessage !== " "){
        errorBody.code = "Validation Failed."
      }

      return errorBody;
    }

    const isValid = validateRequest(event);
    if(isValid.code !== "OK" ){
      return isValid;
    }

		//request validation goes here
		return calculateRiskUtility(event);
    //call to Accertify
  }
    catch (error) {
    //generic error handler
    return {
      statusCode: 500,
      message: "Error in mason-event-risk-entity /calculate-risk",
      errorName: error.name,
      errorMessage: error.message,
    };
  }
}

  