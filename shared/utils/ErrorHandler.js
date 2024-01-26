import pino from 'pino';

const logger = pino({
  level: process.env.PINO_LOG_LEVEL || "info",
});

export const downStreamErrorAxios = (inError, downStreamSystem) => {
  if (inError.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    logger.error(inError.response.data);
    logger.error(inError.response.status);
    logger.error(inError.response.headers);
  } else if (inError.request) {
    // The request was made but no response was received
    // `error.request` is an instance of XMLHttpRequest in the browser 
    // and an instance of http.ClientRequest in node.js
    logger.error(inError.request);
  } else {
    // Something happened in setting up the request that triggered an Error
    logger.error('Error', inError.message);
  }

  const buildError = {
    code: 'Downstream Error',
    message: 'The following system experienced an error: ' + downStreamSystem,
  };

  return buildError;
}


export const downStreamError = (inError, inEvent, downStreamSystem) => {
  logger.debug({
    errorStack: inError.stack,
    errorMessage: inError.message,
    event: inEvent
  });

  var buildError = {
    code: "Downstream Error",
    message: "The following system experienced an error: " + downStreamSystem
  }

  return buildError;
}

export const badRequestFault = (inError, inEvent) => {
  logger.debug({
    errorStack: inError.stack,
    errorMessage: inError.message,
    event: inEvent
  });

  var buildError = {
    code: "Bad Request",
    message: "The server did not understand your request."
  }

  return buildError
}

export const generalServerFault = (inError, inEvent) =>{
  logger.debug({
    errorStack: inError.stack,
    errorMessage: inError.message,
    event: inEvent
  });

  var buildError = {
    code: "General Error Occurred",
    message: "Unknown error occurred while processing your request."
  }
return buildError
}

export const validationError = (inError, inEvent) => {
  logger.debug({
    errorStack: inError.stack,
    errorMessage: inError.message,
    event: inEvent
  });

  var buildError = {
    code: "Bad Request",
    message: inError.message
  }
return buildError
}
