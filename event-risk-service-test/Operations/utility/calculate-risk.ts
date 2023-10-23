import { IMasonRequest, IMasonResponse, IMasonHits, IRiskResult } from "../../Definitions/MasonEventRiskDef";
import { IAccertifyRequest, IAccertifyResponse } from "../../Definitions/AccertifyEventRiskDef";

export const calculateRiskUtility = async (event: any) => {
	try {
		
    const mapMasonToAccertify = (inBody: IMasonRequest): IAccertifyRequest => {
      const accRequest : IAccertifyRequest = {};

      if(inBody.eventSource){
        accRequest.eventSource = inBody.eventSource;
      }
      if(inBody.divisionCode){
        accRequest.brand = inBody.divisionCode;
      }
      if(inBody.BaseParameters){
        
        if(inBody.BaseParameters.isSuccess){
          accRequest.success = String(inBody.BaseParameters.isSuccess);
        }
        if(inBody.BaseParameters.thirdPartyLogin){
          accRequest.thirdPartyLogin = inBody.BaseParameters.thirdPartyLogin;
        }
      }

      return accRequest;

    }
    //map Mason CO to Accertfy object
    const accertifyRequest = mapMasonToAccertify(event);

    //call to Accertify
    //3rd party call to accertify using accertifyRequest as the data for the request
    const mockAccertifyResponse: IAccertifyResponse = {
      "eventID": "9Q9RLUG=GNCOpOs6f3NvwRk3CEU6sTfYLm0",
      "eventDetails": {
          "deviceDetails": {
              "deviceIDConfidence": null,
              "deviceIDNew": false,
              "deviceIDFirstSeen": 1687959738000,
              "deviceIDTimesSeen": 2052,
              "deviceID": "cc612a05-7dba-4ba8-8692-5246d348d0fd"
          },
      },
      "messages": {
          "warning": [],
          "error": [],
          "info": []
      },
      "results": {
          "riskScore": {
              "score": 5,
              "reasonCodes": {
                  "riskFactors": [],
                  "trustFactors": []
              },
              "recommendationCode": "Approve",
              "insights": [
                  "credentialStuffing",
                  "multipleAccounts"
              ]
          }
      },
      "status": true
  };

    //response transformation if needed
    const mapAccertifyToMason = (inBody: IAccertifyResponse): IMasonResponse => {
      const riskResult : IRiskResult = {};
      const masonResponse : IMasonResponse = {};
     
      if(inBody.status && inBody.status === true){
        masonResponse.code = "OK";
      }
      if(inBody.eventID){
        riskResult.eventId = inBody.eventID;
      }
      if(inBody.results && inBody.results.riskScore){
        const riskScore = inBody.results.riskScore;

        if(riskScore.score){
          riskResult.score = String(riskScore.score);
        }
        if(riskScore.recommendationCode){
          riskResult.recommendationCode = riskScore.recommendationCode;
        }
        if(riskScore.recommendationDetail){
          riskResult.recommendationDetail = riskScore.recommendationDetail;
        }
        if(riskScore.reasonCodes && riskScore.reasonCodes.trustFactors && riskScore.reasonCodes.trustFactors.length > 0){
          riskResult.TrustFactors = riskScore.reasonCodes.trustFactors;
        }
        if(riskScore.reasonCodes && riskScore.reasonCodes.riskFactors && riskScore.reasonCodes.riskFactors.length > 0){
          riskResult.RiskFactors = riskScore.reasonCodes.riskFactors;
        }
      }
      if(inBody.listHits){
        if(inBody.listHits.negativeValues){
          riskResult.NegativeHits = [];
          for(var i = 0; i < inBody.listHits.negativeValues.length; i++){
            const inNegativeValues = inBody.listHits.negativeValues[i];
            const outNegativeValues: IMasonHits = {};

            if(inNegativeValues.fieldName){
              outNegativeValues.name = inNegativeValues.fieldName;
            }
            if(inNegativeValues.type){
              outNegativeValues.type = inNegativeValues.type;
            }
            if(inNegativeValues.value){
              outNegativeValues.value = inNegativeValues.value;
            }
            if(inNegativeValues.created){
              outNegativeValues.createdOn = inNegativeValues.created;
            }
            if(inNegativeValues.lastSeen){
              outNegativeValues.lastSeenOn = inNegativeValues.lastSeen;
            }
            if(inNegativeValues.timesHit){
              outNegativeValues.timesHit = inNegativeValues.timesHit;
            }
            riskResult.NegativeHits.push(outNegativeValues);
          }
        }
        if(inBody.listHits.positiveValues){
          riskResult.PositiveHits = [];
          for(var j = 0; j < inBody.listHits.positiveValues.length; j++){
            const inPostiveValues = inBody.listHits.positiveValues[j];
            const outPositiveValues: IMasonHits = {};

            if(inPostiveValues.fieldName){
              outPositiveValues.name = inPostiveValues.fieldName;
            }
            if(inPostiveValues.type){
              outPositiveValues.type = inPostiveValues.type;
            }
            if(inPostiveValues.value){
              outPositiveValues.value = inPostiveValues.value;
            }
            if(inPostiveValues.created){
              outPositiveValues.createdOn = inPostiveValues.created;
            }
            if(inPostiveValues.lastSeen){
              outPositiveValues.lastSeenOn = inPostiveValues.lastSeen;
            }
            if(inPostiveValues.timesHit){
              outPositiveValues.timesHit = inPostiveValues.timesHit;
            }
            riskResult.PositiveHits.push(outPositiveValues);
          }
        }
      }
      if(inBody.eventDetails && inBody.eventDetails.deviceDetails){
        riskResult.DeviceDetail = {};

        if(inBody.eventDetails.deviceDetails.deviceIDConfidence){
          riskResult.DeviceDetail.deviceIdConfidence = inBody.eventDetails.deviceDetails.deviceIDConfidence;
        }
        if(inBody.eventDetails.deviceDetails.deviceIDFirstSeen){
          riskResult.DeviceDetail.deviceIdFirstSeenOn = inBody.eventDetails.deviceDetails.deviceIDFirstSeen;
        }
        if(inBody.eventDetails.deviceDetails.deviceID){
          riskResult.DeviceDetail.deviceId = inBody.eventDetails.deviceDetails.deviceID;
        }
        if(inBody.eventDetails.deviceDetails.deviceIDNew){
          riskResult.DeviceDetail.isNewDeviceId = inBody.eventDetails.deviceDetails.deviceIDNew;
        }
        if(inBody.eventDetails.deviceDetails.deviceIDTimesSeen){
          riskResult.DeviceDetail.deviceIdTimesSeen = inBody.eventDetails.deviceDetails.deviceIDTimesSeen;
        }
      }
      if(riskResult !== undefined){
        masonResponse.RiskResult = riskResult;
      }
      return masonResponse;
    }

		return mapAccertifyToMason(mockAccertifyResponse);
	} 
    catch (error) {
    //generic error handler
    return {
      statusCode: 500,
      message: "Error in accertify-event-risk-utility /calculate-risk",
      errorName: error.name,
      errorMessage: error.message,
    };
  }
}

  