import pino from 'pino';
import { badRequestFault } from './shared/utils/ErrorHandler.js';
import { authCreditCard } from './operations/AuthCreditCard.js';
import { submitPayment } from './operations/SubmitPayment.js';

const logger = pino({
  level: process.env.PINO_LOG_LEVEL || 'info',
});

export var transactionServiceRouter = async (event) => {
  let apiPath = event.requestPath;

  if (apiPath === '/tokenize-card') {
    return await authCreditCard(event.body);
  } else if (apiPath === '/submit-payment') {
    return await submitPayment(event.body);
  }
};
