import pino from 'pino';
import { calculateRiskEntity } from './operations/entity/calculate-risk';
import { calculateRiskTask } from './operations/task/calculate-risk';
import { calculateRiskUtility } from './operations/utility/calculate-risk';
import { badRequestFault } from './shared/utils/ErrorHandler_ts';

const logger = pino({
  level: process.env.PINO_LOG_LEVEL || 'info',
});

module.exports.eventRiskRouter = async (event: any) => {
  logger.debug({ event }, 'Request from client');
  try {
    const apiPath = event.requestPath;

    //TASK SERVICES
    if (apiPath === '/calculate-risk') {
      return await calculateRiskTask(event.body);
    }

    //ENTITY SERVICES
    if (apiPath === '/entity/calculate-risk') {
      return await calculateRiskEntity(event.body);
    }

    //UTILITY SERVICES
    if (apiPath === '/utility/calculate-risk') {
      return await calculateRiskUtility(event.body);
    }

    //if the apiPath doesn't exist or is incorrect throw an error for the catch block
    throw new Error();
  } catch (error: any) {
    return badRequestFault(error, event);
  }
};
