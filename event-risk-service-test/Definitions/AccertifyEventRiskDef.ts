// REQUEST MAPPINGS
export interface IAccertifyRequest {
	eventSource?: string;
	brand?: string;
	success?: string;
	thirdPartyLogin?: string;
	loyaltyId?: string;
	ipAddress?: string;
	userAgent?: string;
	deviceTransactionID?: string;
	ubaID?: string;
	ubaEvents?: string;
	ubaSessionId?: string;
	accountStatus?: string;
	password?: string;
	hashedPassword?: string;
	previousHashedPassword?: string;
	updatedHashedPassword?: string;
	lastPasswordChangeDate?: Date;
	returnScore?: boolean;
	latitude?: string;
	longitude?: string;
	pageID?: string;
	failureCode?: string;
	updateTrigger?: string;
	transactionID?: string;
	currencyCode?: string;
	paymentAmount?: number;
	chargebackAmount?: number;
	updatedValues?: IAccountUpdate;
	previousValues?: IAccountUpdate;
	paymentMethods?: Array<IPaymentMethods>;
}

export interface IAccountUpdate {
	dateOfBirth?: string;
	gender?: string;
	firstName?: string;
	lastName?: string;
	phone?: string;
	postCode?: string;
	hashedPassword?: string;
	accountID?: string;
	emailAddress?: string;
	username?: string;
	addresses?: [{
		addressType?: string;
		primaryFlag?: string;
		firstName?: string;
		lastName?: string;
		address1?: string;
		address2?: string;
		city?: string;
		region?: string;
	}];
	previousValues?: {
		dateOfBirth?: string;
		gender?: string;
		firstName?: string;
		lastName?: string;
		phone?: string;
		paymentMethods?: Array<IPaymentMethods>;
	}
}

export interface IPaymentMethods {
	paymentType?: string;
	cardNumber?: string;
	expirationMonth?: number;
	expirationYear?: number;
	nameOnCreditCard?: string;
}

//RESPONSE MAPPINGS
export interface IAccertifyResponse {
	status?: boolean;
	eventID?: string;
	results?: {
		riskScore?: {
			score?: number;
			recommendationCode?: string;
			recommendationDetail?: string;
			reasonCodes?: {
				trustFactors?: Array<string>;
				riskFactors?: Array<string>;
			};
			insights?: Array<string>;
		};
	};
	listHits?: {
		negativeValues?: Array<IListHitValues>;
		positiveValues?: Array<IListHitValues>;
	};
	eventDetails?: {
		deviceDetails?: {
			deviceIDConfidence?: string | null;
			deviceIDFirstSeen?: number;
			deviceID?: string;
			deviceIDNew?: boolean;
			deviceIDTimesSeen?: number;
		};
	}
	messages?: {
		error?: Array<string>;
		warning?: Array<string>;
		info?: Array<string>;
	}

}

export interface IListHitValues {
	fieldName?: string;
	type?: string;
	value?: string;
	created?: string;
	lastSeen?: string;
	timesHit?: number;
}
