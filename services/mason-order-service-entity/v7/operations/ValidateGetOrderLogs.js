import pino from 'pino';
import axios from 'axios';
import { downStreamErrorAxios, validationError } from '../shared/utils/ErrorHandler.js';
const logger = pino({
  level: process.env.PINO_LOG_LEVEL || 'info',
});

export var getOrderLogs = async (event) => {
  let resBody;

  //validate the payload
  try {
    const isValid = validateRequest(event.query);
    if (isValid.validationMessage !== '') {
      throw new Error(isValid.validationMessage);
    }
  } catch (error) {
    return validationError(error, event);
  }

  //make call to advantage order utility if passed validation
  try {
    let config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: `https://${process.env.MASON_DOMAIN}${process.env.ADVANTAGE_ORDER_SERVICE_UTILITY_V8_BASE_URL}/fn/get-order-logs`,
      headers:{
        'Content-Type': 'application/json'
      },
      params: event.query
    };
    
    resBody = await axios(config)
      .then((response) => {
        return response.data;
      })

    return resBody;
  } 
  catch (error) {
    return downStreamErrorAxios(error, 'advantage-order-service-utility');
  }
};

/**
 * Validates the request object.
 * @param inBody the Mason CO to be validated
 * @returns the validation body, to determine whether it's a valid call or not.
 */
export var validateRequest = (query) => {
  const errorBody = {
    validationMessage: '',
  };

  if (!query.orderId && !query.externalOrderId) {
    errorBody.validationMessage += 'Field must exist: orderId (querystring) or externalOrderId (querystring)';
  }
  if (!query.divisionCode) {
    errorBody.validationMessage += 'Field must exist: divisionCode (querystring)';
  }

  return errorBody;
};
