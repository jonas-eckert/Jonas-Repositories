import pino from 'pino';
import { badRequestFault } from './shared/utils/ErrorHandler.js';
import { getOrderLogs } from './operations/ValidateGetOrderLogs.js';

const logger = pino({
  level: process.env.PINO_LOG_LEVEL || 'info',
});

export var OrderServiceRouter = async (event) => {
  try {
    logger.debug({event}, "Mason-Order-Service-Entity Request event.")
    let apiPath = event.requestPath;

    if ((apiPath === '/fn/get-order-logs')) {
      return await getOrderLogs(event);
    }
  } catch (error) {
    return badRequestFault(error, event);
  }
};
