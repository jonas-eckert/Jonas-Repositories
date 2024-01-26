import { downStreamError, generalServerFault } from '../shared/utils/ErrorHandler.js';
import pino from 'pino';
import xml2js from 'xml2js';
import te from 'telnet-engine';

const logger = pino({
  level: process.env.PINO_LOG_LEVEL || 'info',
});

let xmlRequest;
let xmlResponse;
let response;

export let getOrderLogs = async (event, query) => {
  //Request Mapping
  try {
    xmlRequest = getOrderLogsUtilReq(event, query);
    logger.debug({ xmlRequest }, 'XML Request after mapping.');
  } catch (error) {
    return generalServerFault(error, event);
  }

  try {

    let engineEvents = (message) =>{     
      console.log("MESSAGE: ", message, '\r\n');
    }

    let en = new te.Engine(process.env.ADVANTAGE_SOCKET_HOST, process.env.ADVANTAGE_SOCKET_PORT);
    en.onConnecting(()=>{engineEvents("Connecting.....")});
    en.onConnectionSuccess(() => {engineEvents("Connection Successful.")})
    en.onConnectionTimeOut(() => {engineEvents('Connection Timed Out')})
    en.onConnectionError(()=>{engineEvents("Connection Error")})
    en.onConnectionEnd(()=>{engineEvents("Connection ended.")});
    en.onResponseTimeOut(()=>{engineEvents("Response timed out.")})
    en.onReceive(()=>{engineEvents("Received a response.")})

    let requestObject = {
      request: xmlRequest,
      test: te.untilMilli(process.env.SOCKET_TIMEOUT),
      foo: (obj) => {
        return obj.response;
      }
    }

    xmlResponse = await en.request(requestObject)
      .then((data) => {
        return data;
      })
      .catch((error) => {
        throw new Error(error)
      })

    en.terminate();
    logger.debug({ xmlResponse }, 'Response from Advantage in XML.');
  } catch (error) {
    return downStreamError(error, event, 'Advantage Socket Connection');
  }

  //Response Mapping
  try {
    let parsedXML;

    let parser = new xml2js.Parser({ explicitArray: false });
    parser.parseString(xmlResponse, (err, result) => {
      if(result !== ''){
        parsedXML = result;
      }
      else{
        throw new Error(err);
      }
    });

    response = getOrderLogsUtilRes(parsedXML);
    logger.debug({ response }, 'Mason CO response after mapping.');
  } catch (error) {
    return generalServerFault(error, event);
  }

  return response;
};

//transforms inbound request into xml and advantage object
export function getOrderLogsUtilReq(inBody, inQuery) {
  let buildXMLReq = {
    OrderLog_v1: {},
  };

  if (inQuery.orderId) {
    buildXMLReq.OrderLog_v1.order_no = inQuery.orderId;
  }
  if (inQuery.divisionCode) {
    buildXMLReq.OrderLog_v1.title = inQuery.divisionCode;
  }
  if (inQuery.externalOrderId) {
    buildXMLReq.OrderLog_v1.generic_order_no = inQuery.externalOrderId;
  }

  let builder = new xml2js.Builder();
  var xmlPayload = builder.buildObject(buildXMLReq);

  return xmlPayload;
}

//transforms inbound response into json and mason co
export function getOrderLogsUtilRes(inBody) {
  let buildResponse = {};

  if (inBody.OrderLog_v1Response && inBody.OrderLog_v1Response.Order) {
    if (inBody.OrderLog_v1Response.Order.order_no) {
      buildResponse.orderId = inBody.OrderLog_v1Response.Order.order_no;
    }
    if (inBody.OrderLog_v1Response.CommandStatus) {
      let inCommand = inBody.OrderLog_v1Response.CommandStatus;

      if (inCommand.code) {
        buildResponse.code = inCommand.code;
      }
      if (inCommand.text) {
        buildResponse.message = inCommand.text;
      }
      if (inCommand.code && inCommand.code !== 'OK' && inCommand.text) {
        buildResponse.debugMessage = inCommand.code;
      }
    }
    if (
      inBody.OrderLog_v1Response.Order.Details &&
      inBody.OrderLog_v1Response.Order.Details.Detail &&
      inBody.OrderLog_v1Response.Order.Details.Detail.length > 0
    ) {
      buildResponse.Logs = [];
      for (let i = 0; i < inBody.OrderLog_v1Response.Order.Details.Detail.length; i++) {
        let inDetails = inBody.OrderLog_v1Response.Order.Details.Detail[i];
        let buildLog = {};

        if (inDetails.seq) {
          buildLog.sequence = inDetails.seq;
        }
        if (inDetails.moddt) {
          buildLog.updatedOn = inDetails.moddt;
        }
        if (inDetails.modby) {
          buildLog.updatedBy = inDetails.modby;
        }
        if (inDetails.prgram) {
          buildLog.program = inDetails.prgram;
        }
        if (inDetails.event) {
          buildLog.event = inDetails.event;
        }
        if (inDetails.data1) {
          buildLog.oldStatus = inDetails.data1;
        }
        if (inDetails.data2) {
          buildLog.newStatus = inDetails.data2;
        }
        buildResponse.Logs.push(buildLog);
      }
    }
  }
  return buildResponse;
}
