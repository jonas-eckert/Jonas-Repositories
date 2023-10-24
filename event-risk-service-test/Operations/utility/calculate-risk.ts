import pino from 'pino';
import { IMasonRequest, IMasonResponse, IMasonHits, IRiskResult } from "../../Definitions/MasonEventRiskDef";
import { IAccertifyRequest, IAccertifyResponse } from "../../Definitions/AccertifyEventRiskDef";
import { fetchSecret } from '../../shared/utils/FetchSecrets';
const logger = pino();

export const calculateRiskUtility = async (event: any) => {
	try {

    //calls function to convert from mason co to accertify object
    const accertifyRequest = mapMasonToAccertify(event);

    //call to Accertify
    //3rd party call to accertify using accertifyRequest as the data for the request
    const mockAccertifyResponse: IAccertifyResponse = {
      'status': true,
      'eventID': 'f467d441-29bc-4be0-b40e-c3b247d68fa2',
      'messages': {
        'error': [],
        'warning': [],
        'info': [
          'debug logging is enabled',
          'duration to process transaction: 200 ms'
        ]
      },
    'eventDetails': {
        'deviceDetails':  {
            'deviceIDConfidence': 99,
            'deviceIDFirstSeen': '1634064122326',
            'deviceID': '123456',
            'deviceIDNew': false,
            'deviceIDTimesSeen': 2
         } 
     },
      'results': {
        'riskScore': {
          'score': 88,
          'reasonCodes': {
            'riskFactors': [
              'Device Reputation',
              'Connection History'
            ],
            'trustFactors': [
              'Email History',
              'Email Reputation'
            ]
          },
          'insights': [
            'emailAliased',
            'suspectedBot'
          ]
        },
        'listHits': {
          'negativeValues': [ {
            'type': 'IP Address',
            'fieldName': 'realIpAddress',
            'value': '128.210.79.50',
            'created': '1580852422000',
            'timesHit': 13,
            'lastSeen': '1580853495000'
          },
          {
            'type': 'IP Address',
            'fieldName': 'ipAddress',
            'value': '127.0.0.1',
            'created': "1580852423000",
            'timesHit': 14,
            'lastSeen': "1580853496000"
          } ],
          'positiveValues': [ {
            'type': 'Email Address',
            'fieldName': 'emailAddress',
            'value': 'joe@no.tld',
            'created': '1580852424000',
            'timesHit': 89,
            'lastSeen': '1580853497000'
          } ]
        }
      }
    };

    console.log(mapAccertifyToMason(mockAccertifyResponse))
    //Returns back to the original caller with a mason co
		// return mapAccertifyToMason(mockAccertifyResponse);
    return "cool"
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

export const mapMasonToAccertify = (inBody: IMasonRequest): IAccertifyRequest => {
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

export const mapAccertifyToMason = (inBody: IAccertifyResponse): IMasonResponse => {
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
    if(riskScore.insights && riskScore.insights.length > 0){
      riskResult.Insights = riskScore.insights;
    }
    if(inBody.results.listHits){
      if(inBody.results.listHits.negativeValues){
        riskResult.NegativeHits = [];
        for(var i = 0; i < inBody.results.listHits.negativeValues.length; i++){
          const inNegativeValues = inBody.results.listHits.negativeValues[i];
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
      if(inBody.results.listHits.positiveValues){
        riskResult.PositiveHits = [];
        for(var j = 0; j < inBody.results.listHits.positiveValues.length; j++){
          const inPostiveValues = inBody.results.listHits.positiveValues[j];
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
  }
  
  if(inBody.eventDetails && inBody.eventDetails.deviceDetails){
    riskResult.DeviceDetail = {};

    if(inBody.eventDetails.deviceDetails.deviceIDConfidence){
      riskResult.DeviceDetail.deviceIdConfidence = String(inBody.eventDetails.deviceDetails.deviceIDConfidence);
    }
    if(inBody.eventDetails.deviceDetails.deviceIDFirstSeen){
      riskResult.DeviceDetail.deviceIdFirstSeenOn = Number(inBody.eventDetails.deviceDetails.deviceIDFirstSeen);
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

  