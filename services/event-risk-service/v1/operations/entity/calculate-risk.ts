import pino from 'pino';
import { IMasonRequest } from '../../definitions/MasonEventRiskDef';
import { downStreamError, validationError } from '../../shared/utils/ErrorHandler_ts';
import { calculateRiskUtility } from '../utility/calculate-risk';
const logger = pino({
  level: process.env.PINO_LOG_LEVEL || 'info',
});

export var calculateRiskEntity = async (event: IMasonRequest) => {
  //validate the payload
  try {
    const isValid = validateRequest(event);
    if (isValid.validationMessage !== '') {
      throw new Error(isValid.validationMessage);
    }
  } catch (error: any) {
    return validationError(error, event);
  }

  //make call to Accertify utility if passed validation
  try {
    return await calculateRiskUtility(event);
  } catch (error) {
    return downStreamError(error, event, 'Accertify-Event-Risk-Service-Utility');
  }
};

/**
 * Validates the request object.
 * @param inBody the Mason CO to be validated
 * @returns the validation body, to determine whether it's a valid call or not.
 */
export var validateRequest = (inBody: any) => {
  const errorBody = {
    validationMessage: '',
  };

  if (!inBody.eventType) {
    errorBody.validationMessage += 'An eventType must exist.';
  }
  if (
    inBody.eventType &&
    !/^(login|logout|accountCreate|accountUpdate|passwordForgotUpdate|passwordUpdate|payment|verification)$/g.test(
      inBody.eventType,
    )
  ) {
    errorBody.validationMessage += 'Eventtype ' + inBody.eventType + ' is not valid.';
  }
  if (!inBody.eventSource) {
    errorBody.validationMessage += 'Eventsource must exist.';
  }
  if (inBody.eventType === 'login') {
    if (!inBody.BaseParameters.isSuccess && inBody.BaseParameters.isSuccess !== false) {
      errorBody.validationMessage += 'isSuccess must exist when eventType is login.';
    }
  }
  if (inBody.eventType === 'logout') {
    if (
      !inBody.Customer ||
      !inBody.Customer.DivisionCustomers ||
      !inBody.Customer.DivisionCustomers[0] ||
      !inBody.Customer.DivisionCustomers[0].DivisionCustomerInfo ||
      !inBody.Customer.DivisionCustomers[0].DivisionCustomerInfo.webAccountId
    ) {
      errorBody.validationMessage += 'webAccountId must exist when eventType is logout.';
    }
  }
  if (inBody.eventType === 'accountCreate') {
    if (!inBody.BaseParameters.isSuccess && inBody.BaseParameters.isSuccess !== false) {
      errorBody.validationMessage += 'isSuccess must exist when eventType is accountCreate.';
    }
  }
  if (inBody.eventType === 'accountUpdate') {
    if (
      !inBody.Customer ||
      !inBody.Customer.DivisionCustomers ||
      !inBody.Customer.DivisionCustomers[0] ||
      !inBody.Customer.DivisionCustomers[0].DivisionCustomerInfo ||
      !inBody.Customer.DivisionCustomers[0].DivisionCustomerInfo.webAccountId
    ) {
      errorBody.validationMessage += 'webAccountId must exist when eventType is accountUpdate.';
    }
  }
  if (inBody.eventType === 'passwordForgotUpdate') {
    if (
      !inBody.Customer ||
      !inBody.Customer.DivisionCustomers ||
      !inBody.Customer.DivisionCustomers[0] ||
      !inBody.Customer.DivisionCustomers[0].DivisionCustomerInfo ||
      !inBody.Customer.DivisionCustomers[0].DivisionCustomerInfo.webAccountId
    ) {
      errorBody.validationMessage += 'webAccountId must exist when eventType is passwordForgotUpdate.';
    }
    if (!inBody.BaseParameters.updateTrigger) {
      errorBody.validationMessage += 'updateTrigger must exist when eventType is passwordForgotUpdate.';
    }
  }
  if (inBody.eventType === 'payment') {
    if (!inBody.BaseParameters.transactionId) {
      errorBody.validationMessage += 'transactionId must exist when eventType is payment.';
    }
    if (!inBody.BaseParameters.paymentAmount && inBody.BaseParameters.paymentAmount !== 0) {
      errorBody.validationMessage += 'paymentAmount must exist when eventType is payment.';
    }
    if (!inBody.BaseParameters.currencyCode) {
      errorBody.validationMessage += 'currencyCode must exist when eventType is payment.';
    }
    if (
      !inBody.BaseParameters.isSuccess &&
      !inBody.BaseParameters.isSuccess &&
      inBody.BaseParameters.isSuccess !== false
    ) {
      errorBody.validationMessage += 'isSuccess must exist when eventType is payment.';
    }
  }
  if (inBody.eventType === 'verification') {
    if (
      !inBody.Customer ||
      !inBody.Customer.DivisionCustomers ||
      !inBody.Customer.DivisionCustomers[0] ||
      !inBody.Customer.DivisionCustomers[0].DivisionCustomerInfo ||
      !inBody.Customer.DivisionCustomers[0].DivisionCustomerInfo.webAccountId
    ) {
      errorBody.validationMessage += 'webAccountId must exist when eventType is verification.';
    }
    if (!inBody.BaseParameters.updateEventId) {
      errorBody.validationMessage += 'updateEventId must exist when eventType is verification.';
    }
    if (!inBody.BaseParameters.verificationType) {
      errorBody.validationMessage += 'verificationType must exist when eventType is verification.';
    }
    if (
      inBody.BaseParameters.verificationType &&
      !/^(appAuthenticator|appPush|captcha|email|kbAnswers|other|phoneCall|securityQuestions|Sms)$/g.test(
        inBody.BaseParameters.verificationType,
      )
    ) {
      errorBody.validationMessage += 'VerificationType ' + inBody.BaseParameters.verificationType + ' is not valid.';
    }
    if (!inBody.BaseParameters.verificationStatus) {
      errorBody.validationMessage += 'verificationStatus must exist when eventType is verification.';
    }
    if (
      inBody.BaseParameters.verificationStatus &&
      !/^(abandoned|expired|fail|success)$/g.test(inBody.BaseParameters.verificationStatus)
    ) {
      errorBody.validationMessage +=
        'VerificationStatus ' + inBody.BaseParameters.verificationStatus + ' is not valid.';
    }
  }

  return errorBody;
};
