import pino from 'pino';
import { badRequestFault } from './shared/utils/ErrorHandler.js';
import { getOrderLogs } from './operations/GetOrderLogs.js';

const logger = pino({
  level: process.env.PINO_LOG_LEVEL || 'info',
});

export var orderServiceRouter = async (event) => {
  try {
    logger.debug({event}, "Advantage-Order-Service-Utility Request Event.")
    let apiPath = event.requestPath;
    
    if(apiPath === "/fn/get-order-logs"){
      
      return await getOrderLogs(event, event.query);
    }
  } 
  catch (error) {
    badRequestFault(error, event);
  }
};
