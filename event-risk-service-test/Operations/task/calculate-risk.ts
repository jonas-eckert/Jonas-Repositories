import { calculateRiskEntity } from "../entity/calculate-risk";
import { IMasonRequest, IMasonResponse } from "../../Definitions/MasonEventRiskDef";
import { IOracleRequest, IOracleResponse } from "../../Definitions/OracleEventRiskDef";

export const calculateRiskTask = async (event) => {
	try {  
    /**
     * calls function to convert from oracle to mason common object
     */
    const reqBody = mapOracleToMason(event.body);

		/**
     * calls the calculateRiskEntity service passing in the Mason CO
     */
    var resBody = calculateRiskEntity(reqBody)


    
    //Returns back to the original caller the Oracle object  
		return resBody;
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
  const masonRequest : IMasonRequest = {}

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

    if(inBody.Parameters.isSuccess && inBody.Parameters.isSuccess === true){
      masonRequest.BaseParameters.isSuccess = true;
    }else {
      masonRequest.BaseParameters.isSuccess = false;
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
      if(inBody.Parameters.previousHashedPassword){
        masonRequest.PreviousCustomer = {
          CustomerInfo: {
            hashedPassword: inBody.Parameters.previousHashedPassword
          }
        }
      if(inBody.Parameters.updatedHashedPassword){
        masonRequest.Customer = {
          CustomerInfo: {
            hasedPassword: inBody.Parameters.updatedHashedPassword
          }
        } 
      }
      }
    }else{
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
  }
  return masonRequest;
}