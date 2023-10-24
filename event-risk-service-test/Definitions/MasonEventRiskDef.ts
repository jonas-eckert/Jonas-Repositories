//REQUEST
export interface IMasonRequest {
    eventType?: string;
    eventSource?: string;
    divisionCode?: string;
    BaseParameters?: {
      isSuccess?: boolean;
      thirdPartyLogin?: string;
      loyaltyId?: string,
      ipAddress?: string,
      userAgent?: string,
      deviceTransactionId?: string,
      ubaId?: string,
      ubaEvents?: string,
      hashedPassword?: string,
      ubaSessionId?: string,
      pageId?: string,
      returnScore?: boolean;
      accountStatus?: string;
      password?: string;
      previousHashedPassword?: string;
      updatedHashedPassword?: string;
      lastPasswordChangeDate?: string;
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
    },
    Customer?: ICustomer;
    PreviousCustomer?: ICustomer;
    Payments?: Array<IPayments>;
    PreviousPayments?: Array<IPayments>;
  }
  
  export interface ICustomer {
    CustomerInfo?: {
      firstName?: string;
      lastName?: string;
      hashedPassword?: string;
      dob?: string;
      gender?: string;
      phone?: string;
      zip?: string;
    },
    DivisionCustomers?: [{
      DivisionCustomerInfo?: {
        webAccountId?: string
      }
    }],
    EmailRecords?: [{
      EmailInfo?: {
        emailAddress?: string
      }
    }],
    BillingAddress?: IAddress;
    RecipientAddresses?: Array<IAddress>
  }
  export interface IAddress {
    HeaderInfo?: {
      addressType?: string;
      isPrimary?: boolean;
    },
    PersonInfo?: {
      firstName?: string;
      lastName?: string;
    },
    LocationInfo?: {
      line1?: string;
      line2?: string;
      city?: string;
      state?: string;
      zip?: string;
      country?: string;
      emailAddress?: string;
      phoneNumber?: string;
    }
  }

  export interface IPayments {
    PaymentInfo?: {
      paymentType?: string;
    },
    PaymentDetail?: {
      cardIssuerId?: string;
      lastDigitsOfPan?: number;
      SecureCreditCardInfo?: {
        panTokenized?: string;
        expirationDate?: string;
        nameOnCard?: string;
      }
    },
    TransactionDetail?: {
      CreditCardInfo?: {
        avsResponseCode?: string;
        cvvResponseCode?: string;
      }
    }
  }
  
  
  //RESPONSE
  export interface IMasonResponse {
    code?: string;
    message?: string;
    debugMessage?: string;
    RiskResult?: IRiskResult;
  }
  
  export interface IRiskResult {
    eventId?: string;
    score?: string;
    recommendationCode?: string;
    recommendationDetail?: string;
    nextAction?: string;
    TrustFactors?: Array<string>;
    RiskFactors?: Array<string>;
    Insights?: Array<string>
    NegativeHits?: Array<IMasonHits>;
    PositiveHits?: Array<IMasonHits>;
    DeviceDetail?: {
      deviceIdConfidence?: string;
      deviceIdFirstSeenOn?: number;
      deviceId?: string;
      isNewDeviceId?: boolean;
      deviceIdTimesSeen?: number;
    };
    Messages?: Array<object>
  }
  
  export interface IMasonHits {
    name?: string;
    type?: string;
    value?: string;
    createdOn?: string;
    lastSeenOn?: string;
    timesHit?: number;
  }
  