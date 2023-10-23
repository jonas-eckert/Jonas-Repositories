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
    },
    PreviousCustomer?: {
      CustomerInfo?: {
        hashedPassword?: string;
      }
    },
    Customer?: ICustomer
  }
  
  export interface ICustomer {
    CustomerInfo?: {
      firstName?: string;
      lastName?: string;
      hasedPassword?: string;
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
    }]
  }
  
  
  //RESPONSE
  export interface IMasonResponse {
    code?: string;
    RiskResult?: IRiskResult;
  }
  
  export interface IRiskResult {
    eventId?: string;
    score?: string;
    recommendationCode?: string;
    recommendationDetail?: string;
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
  