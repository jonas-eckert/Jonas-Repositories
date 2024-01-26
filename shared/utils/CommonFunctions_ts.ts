import pino from 'pino';

const logger = pino();

export function formatPhoneNumber(inPhone: any, addOne: boolean) {
  const phoneDigits = inPhone.replace(/(\(|\)|\s|-)/g, '');

  if (phoneDigits.length > 10) {
    return phoneDigits;
  } else if (phoneDigits.length === 10 && addOne) {
    return '1' + phoneDigits;
  } else {
    return '';
  }
}
