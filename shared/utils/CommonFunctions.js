import pino from "pino";

var logger = pino();

export function formatPhoneNumber(inPhone, addOne) {
  var phoneDigits = inPhone.replace(/(\(|\)|\s|-)/g, "");

  if (phoneDigits.length > 10) {
    return phoneDigits;
  } 
  else if (phoneDigits.length === 10 && addOne) {
    return "1" + phoneDigits;
  } 
  else {
    return "";
  }
}
