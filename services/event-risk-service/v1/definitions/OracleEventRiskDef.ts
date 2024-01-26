//REQUEST
export interface IOracleRequest {
  eventType?: string;
  eventSource?: string;
  divisionCode?: string;
  Parameters?: {
    firstName?: string;
    lastName?: string;
    pageId?: string;
    hashedPassword?: string;
    ubaSessionId?: string;
    ubaEvents?: string;
    ubaId?: string;
    deviceTransactionId?: string;
    userAgent?: string;
    ipAddress?: string;
    emailAddress?: string;
    webAccountId?: string;
    isSuccess?: boolean;
    thirdPartyLogin?: string;
    loyaltyId?: string;
    accountStatus?: string;
    password?: string;
    previousHashedPassword?: string;
    updatedHashedPassword?: string;
    lastPasswordChangeDate?: string;
    returnScore?: boolean;
    latitude?: string;
    longitude?: string;
    failureCode?: string;
    updateTrigger?: string;
    transactionId?: string;
    currencyCode?: string;
    verificationType?: string;
    verificationStatus?: string;
    verificationAttempts?: number;
    updateEventId?: string;
    paymentAmount?: number;
    dob?: string;
    gender?: string;
    phone?: string;
    zip?: string;
    previousDob?: string;
    previousGender?: string;
    previousFirstName?: string;
    previousLastName?: string;
    previousPhone?: string;
    previousZip?: string;
    previousEmailAddress?: string;
    Addresses?: Array<IAddress>;
    PreviousAddresses?: Array<IAddress>;
    PaymentMethods?: Array<IPaymentMethods>;
    PreviousPaymentMethods?: Array<IPaymentMethods>;
  };
}
export interface IPaymentMethods {
  paymentType?: string;
  panTokenized?: string;
  expirationDate?: string;
  nameOnCard?: string;
  cardIssuerId?: string;
  lastDigitsOfPan?: number;
  avsResponseCode?: string;
  cvvResponseCode?: string;
}
export interface IAddress {
  addrType?: string;
  isPrimary?: boolean;
  firstName?: string;
  lastName?: string;
  addr1?: string;
  addr2?: string;
  city?: string;
  state?: string;
  zip?: string;
  country?: string;
  email?: string;
  phone?: string;
}

//RESPONSE
export interface IOracleResponse {
  code?: string;
  message?: string;
  debugMessage?: string;
  eventId?: string;
  score?: string;
  recommendationCode?: string;
  recommendationDetail?: string;
  nextAction?: string;
  trustFactors?: Array<string>;
  riskFactors?: Array<string>;
  insights?: Array<string>;
  DeviceDetail?: {
    deviceIdConfidence?: string;
    deviceIdFirstSeenOn?: string;
    deviceId?: string;
    isNewDeviceId?: boolean;
    deviceIdTimesSeen?: number;
  };
}
