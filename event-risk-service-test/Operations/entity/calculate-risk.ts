import axios from 'axios';
import { calculateRiskUtility } from "../utility/calculate-risk";
import { IMasonRequest } from '../../Definitions/MasonEventRiskDef';

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
        validationMessage: ""
      };

      if(!inBody.eventType){
        errorBody.validationMessage = "Eventtype must exist."
      }
      if(inBody.eventType && !(/^(login|logout|accountCreate|accountUpdate|passwordForgotUpdate|passwordUpdate|Payment|verification)$/g.test(inBody.eventType))){
        errorBody.validationMessage = "Eventtype " + inBody.eventType + " is not valid."
      }
      if(!inBody.eventSource){
        errorBody.validationMessage = "Eventsource must exist"
      }
      if(inBody.eventType === "login" && !inBody.BaseParameters.isSuccess){
        errorBody.validationMessage = "isSuccess must exist when eventType is login."
      }

      if(errorBody.validationMessage !== ""){
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

  