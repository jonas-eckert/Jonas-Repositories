import { describe, expect, it, test } from '@jest/globals';
import { submitPayment_Response } from '../operations/SubmitPayment';

let event, resBody, panTokenized;

describe('SubmitPayment response transformation suite.', () => {
  describe('A complete response with a panTokenzied request.', () => {
    beforeAll(() => {
      panTokenized = "8933403071951732"
      event = {
        "gatewayResponse": {
          "transactionType": "CHARGE",
          "transactionState": "CAPTURED",
          "transactionOrigin": "ECOM",
          "transactionProcessingDetails": {
            "orderId": "CHG0142e69b20b65f4781a157a3867080052f",
            "transactionTimestamp": "2024-01-24T14:31:51.172783518Z",
            "apiTraceId": "e766bbb464c64117b9d681b5e0d7dc26",
            "clientRequestId": "9178136",
            "transactionId": "e766bbb464c64117b9d681b5e0d7dc26"
          }
        },
        "paymentReceipt": {
          "approvedAmount": {
            "total": 15325,
            "currency": "USD"
          },
          "processorResponseDetails": {
            "approvalStatus": "APPROVED",
            "approvalCode": "OK2217",
            "referenceNumber": "81b5e0d7dc26",
            "processor": "FISERV",
            "host": "NASHVILLE",
            "networkRouted": "MASTERCARD",
            "networkInternationalId": "0001",
            "responseCode": "000",
            "responseMessage": "Approved",
            "hostResponseCode": "00",
            "hostResponseMessage": "APPROVAL",
            "responseIndicators": {
              "alternateRouteDebitIndicator": false,
              "signatureLineIndicator": false,
              "signatureDebitRouteIndicator": false
            },
            "bankAssociationDetails": {
              "associationResponseCode": "M000",
              "avsSecurityCodeResponse": {
                "streetMatch": "MATCHED",
                "postalCodeMatch": "MATCHED",
                "securityCodeMatch": "NOT_CHECKED",
                "association": {
                  "avsCode": "Y",
                  "securityCodeResponse": "X"
                }
              }
            },
          }
        },
        "source": {
          "sourceType": "PaymentToken",
          "card": {
            "nameOnCard": "Jessie James",
            "expirationMonth": "12",
            "expirationYear": "2025",
            "bin": "542418",
            "last4": "1732",
            "scheme": "MASTERCARD"
          }
        },
        "billingAddress": {
          "address": {
            "street": "1251 1st Ave",
            "houseNumberOrName": "Suit 1",
            "city": "Chippewa Falls",
            "stateOrProvince": "WI",
            "postalCode": "54729",
            "country": "US"
          }
        },
        "cardDetails": {
          "binSource": "FISERV",
          "recordType": "DETAIL",
          "lowBin": "542418",
          "highBin": "542418",
          "binLength": "06",
          "binDetailPan": "16",
          "issuerBankName": "CITIBANK N.A.",
          "countryCode": "USA",
          "detailedCardProduct": "MASTERCARD",
          "detailedCardIndicator": "CREDIT",
          "pinSignatureCapability": "SIGNATURE",
          "issuerUpdateYear": "22",
          "issuerUpdateMonth": "04",
          "issuerUpdateDay": "22",
          "regulatorIndicator": "NON_REGULATED",
          "cardClass": "CONSUMER",
          "anonymousPrepaidIndicator": "NON_ANONYMOUS",
          "productId": "MPL",
          "accountFundSource": "CREDIT",
          "panLengthMin": "16",
          "panLengthMax": "16",
          "moneySendIndicator": "UNKNOWN"
        },
        "merchantDetails": {
          "tokenType": "LHC0",
          "terminalId": "10000001",
          "merchantId": "100173000000053"
        },
        "transactionDetails": {
          "captureFlag": true,
          "transactionCaptureType": "host",
          "partialApproval": true,
          "processingCode": "000000",
          "merchantOrderId": "45678915",
          "merchantInvoiceNumber": "45678915",
          "primaryTransactionType": "CHARGE_SALE",
          "retrievalReferenceNumber": "81b5e0d7dc26"
        },
      };
      resBody = submitPayment_Response(event, panTokenized)
    });
    it('code must be OK', () => {
      expect(resBody.code).toBe('OK');
    });
    it('message must be M000 : APPROVAL', () => {
      expect(resBody.message).toBe('M000 : APPROVAL');
    });
    it('transactionTag must be e766bbb464c64117b9d681b5e0d7dc26', () => {
      expect(resBody.Payment.TransactionDetail.transactionTag).toBe('e766bbb464c64117b9d681b5e0d7dc26');
    });
    it('transactionStatus must be APPROVED', () => {
      expect(resBody.Payment.TransactionDetail.transactionStatus).toBe('APPROVED');
    });
    it('transactionResultCode must be 000', () => {
      expect(resBody.Payment.TransactionDetail.transactionResultCode).toBe('000');
    });
    it('transactionResultMessage must be Approved', () => {
      expect(resBody.Payment.TransactionDetail.transactionResultMessage).toBe('Approved');
    });
    it('transactionId must be 81b5e0d7dc26', () => {
      expect(resBody.Payment.TransactionDetail.transactionId).toBe('81b5e0d7dc26');
    });
    it('bankMessage must be APPROVAL', () => {
      expect(resBody.Payment.TransactionDetail.bankMessage).toBe('APPROVAL');
    });
    it('cardIssuerName must be Mastercard', () => {
      expect(resBody.Payment.TransactionDetail.cardIssuerName).toBe('Mastercard');
    });
    it('panTokenized must be 8933403071951732', () => {
      expect(resBody.Payment.TransactionDetail.panTokenized).toBe('8933403071951732');
    });
    it('bankCode must be 000', () => {
      expect(resBody.Payment.TransactionDetail.bankCode).toBe('000');
    });
    it('cvvResponseCode must be X', () => {
      expect(resBody.Payment.TransactionDetail.cvvResponseCode).toBe('X');
    });
    it('avsResponseCode must be Y', () => {
      expect(resBody.Payment.TransactionDetail.avsResponseCode).toBe('Y');
    });
    it('validityCheck must be undefined', () => {
      expect(resBody.Payment.TransactionDetail.validityCheck).toBeUndefined();
    });
  });

  describe('A complete response with an encrypted Credit Card request.', () => {
    beforeAll(() => {
      event = {
        "gatewayResponse": {
          "transactionType": "CHARGE",
          "transactionState": "CAPTURED",
          "transactionOrigin": "ECOM",
          "transactionProcessingDetails": {
            "orderId": "CHG0142e69b20b65f4781a157a3867080052f",
            "transactionTimestamp": "2024-01-24T14:31:51.172783518Z",
            "apiTraceId": "e766bbb464c64117b9d681b5e0d7dc26",
            "clientRequestId": "9178136",
            "transactionId": "e766bbb464c64117b9d681b5e0d7dc26"
          }
        },
        "paymentReceipt": {
          "approvedAmount": {
            "total": 15325,
            "currency": "USD"
          },
          "processorResponseDetails": {
            "approvalStatus": "APPROVED",
            "approvalCode": "OK2217",
            "referenceNumber": "81b5e0d7dc26",
            "processor": "FISERV",
            "host": "NASHVILLE",
            "networkRouted": "MASTERCARD",
            "networkInternationalId": "0001",
            "responseCode": "000",
            "responseMessage": "Approved",
            "hostResponseCode": "00",
            "hostResponseMessage": "APPROVAL",
            "responseIndicators": {
              "alternateRouteDebitIndicator": false,
              "signatureLineIndicator": false,
              "signatureDebitRouteIndicator": false
            },
            "bankAssociationDetails": {
              "associationResponseCode": "M000",
              "avsSecurityCodeResponse": {
                "streetMatch": "MATCHED",
                "postalCodeMatch": "MATCHED",
                "securityCodeMatch": "NOT_CHECKED",
                "association": {
                  "avsCode": "Y",
                  "securityCodeResponse": "M"
                }
              }
            },
          }
        },
        "source": {
          "sourceType": "PaymentToken",
          "card": {
            "nameOnCard": "Jessie James",
            "expirationMonth": "12",
            "expirationYear": "2025",
            "bin": "542418",
            "last4": "1732",
            "scheme": "MASTERCARD"
          }
        },
        "billingAddress": {
          "address": {
            "street": "1251 1st Ave",
            "houseNumberOrName": "Suit 1",
            "city": "Chippewa Falls",
            "stateOrProvince": "WI",
            "postalCode": "54729",
            "country": "US"
          }
        },
        "cardDetails": {
          "binSource": "FISERV",
          "recordType": "DETAIL",
          "lowBin": "542418",
          "highBin": "542418",
          "binLength": "06",
          "binDetailPan": "16",
          "issuerBankName": "CITIBANK N.A.",
          "countryCode": "USA",
          "detailedCardProduct": "MASTERCARD",
          "detailedCardIndicator": "CREDIT",
          "pinSignatureCapability": "SIGNATURE",
          "issuerUpdateYear": "22",
          "issuerUpdateMonth": "04",
          "issuerUpdateDay": "22",
          "regulatorIndicator": "NON_REGULATED",
          "cardClass": "CONSUMER",
          "anonymousPrepaidIndicator": "NON_ANONYMOUS",
          "productId": "MPL",
          "accountFundSource": "CREDIT",
          "panLengthMin": "16",
          "panLengthMax": "16",
          "moneySendIndicator": "UNKNOWN"
        },
        "merchantDetails": {
          "tokenType": "LHC0",
          "terminalId": "10000001",
          "merchantId": "100173000000053"
        },
        "transactionDetails": {
          "captureFlag": true,
          "transactionCaptureType": "host",
          "partialApproval": true,
          "processingCode": "000000",
          "merchantOrderId": "45678915",
          "merchantInvoiceNumber": "45678915",
          "primaryTransactionType": "CHARGE_SALE",
          "retrievalReferenceNumber": "81b5e0d7dc26"
        },
      };
      resBody = submitPayment_Response(event)
    });
    it('code must be OK', () => {
      expect(resBody.code).toBe('OK');
    });
    it('message must be M000 : APPROVAL', () => {
      expect(resBody.message).toBe('M000 : APPROVAL');
    });
    it('transactionTag must be e766bbb464c64117b9d681b5e0d7dc26', () => {
      expect(resBody.Payment.TransactionDetail.transactionTag).toBe('e766bbb464c64117b9d681b5e0d7dc26');
    });
    it('transactionStatus must be APPROVED', () => {
      expect(resBody.Payment.TransactionDetail.transactionStatus).toBe('APPROVED');
    });
    it('transactionResultCode must be 000', () => {
      expect(resBody.Payment.TransactionDetail.transactionResultCode).toBe('000');
    });
    it('transactionResultMessage must be Approved', () => {
      expect(resBody.Payment.TransactionDetail.transactionResultMessage).toBe('Approved');
    });
    it('transactionId must be 81b5e0d7dc26', () => {
      expect(resBody.Payment.TransactionDetail.transactionId).toBe('81b5e0d7dc26');
    });
    it('bankMessage must be APPROVAL', () => {
      expect(resBody.Payment.TransactionDetail.bankMessage).toBe('APPROVAL');
    });
    it('cardIssuerName must be Mastercard', () => {
      expect(resBody.Payment.TransactionDetail.cardIssuerName).toBe('Mastercard');
    });
    it('bankCode must be 000', () => {
      expect(resBody.Payment.TransactionDetail.bankCode).toBe('000');
    });
    it('cvvResponseCode must be M', () => {
      expect(resBody.Payment.TransactionDetail.cvvResponseCode).toBe('M');
    });
    it('avsResponseCode must be Y', () => {
      expect(resBody.Payment.TransactionDetail.avsResponseCode).toBe('Y');
    });
    it('validityCheck[0] must be PaymentAcceptable', () => {
      expect(resBody.Payment.TransactionDetail.ValidityCheck[0]).toBe('PaymentAcceptable');
    });
    it('validityCheck[1] must be OrderAcceptable', () => {
      expect(resBody.Payment.TransactionDetail.ValidityCheck[1]).toBe('OrderAcceptable');
    });
    it('validityCheck[2] must be Savable', () => {
      expect(resBody.Payment.TransactionDetail.ValidityCheck[2]).toBe('Savable');
    });
  });

  describe('A response with an approvalStatus of DECLINED', () => {
    beforeAll(() => {
      event = {
        "gatewayResponse": {
          "transactionType": "CHARGE",
          "transactionState": "CAPTURED",
          "transactionOrigin": "ECOM",
          "transactionProcessingDetails": {
            "orderId": "CHG0142e69b20b65f4781a157a3867080052f",
            "transactionTimestamp": "2024-01-24T14:31:51.172783518Z",
            "apiTraceId": "e766bbb464c64117b9d681b5e0d7dc26",
            "clientRequestId": "9178136",
            "transactionId": "e766bbb464c64117b9d681b5e0d7dc26"
          }
        },
        "paymentReceipt": {
          "approvedAmount": {
            "total": 15325,
            "currency": "USD"
          },
          "processorResponseDetails": {
            "approvalStatus": "DECLINED",
            "approvalCode": "OK2217",
            "referenceNumber": "81b5e0d7dc26",
            "processor": "FISERV",
            "host": "NASHVILLE",
            "networkRouted": "MASTERCARD",
            "networkInternationalId": "0001",
            "responseCode": "000",
            "responseMessage": "Declined",
            "hostResponseCode": "00",
            "hostResponseMessage": "DECLINE",
            "responseIndicators": {
              "alternateRouteDebitIndicator": false,
              "signatureLineIndicator": false,
              "signatureDebitRouteIndicator": false
            },
            "bankAssociationDetails": {
              "associationResponseCode": "M000",
              "avsSecurityCodeResponse": {
                "streetMatch": "MATCHED",
                "postalCodeMatch": "MATCHED",
                "securityCodeMatch": "NOT_CHECKED",
                "association": {
                  "avsCode": "Y",
                  "securityCodeResponse": "M"
                }
              }
            },
          }
        },
        "source": {
          "sourceType": "PaymentToken",
          "card": {
            "nameOnCard": "Jessie James",
            "expirationMonth": "12",
            "expirationYear": "2025",
            "bin": "542418",
            "last4": "1732",
            "scheme": "MASTERCARD"
          }
        },
        "billingAddress": {
          "address": {
            "street": "1251 1st Ave",
            "houseNumberOrName": "Suit 1",
            "city": "Chippewa Falls",
            "stateOrProvince": "WI",
            "postalCode": "54729",
            "country": "US"
          }
        },
        "cardDetails": {
          "detailedCardProduct": "MASTERCARD",
        },
        "merchantDetails": {
          "tokenType": "LHC0",
          "terminalId": "10000001",
          "merchantId": "100173000000053"
        },
        "transactionDetails": {
          "captureFlag": true,
          "transactionCaptureType": "host",
          "partialApproval": true,
          "processingCode": "000000",
          "merchantOrderId": "45678915",
          "merchantInvoiceNumber": "45678915",
          "primaryTransactionType": "CHARGE_SALE",
          "retrievalReferenceNumber": "81b5e0d7dc26"
        },
      };
      resBody = submitPayment_Response(event)
    });
    it('code must be OK', () => {
      expect(resBody.code).toBe('OK');
    });
    it('message must be M000 : DECLINE', () => {
      expect(resBody.message).toBe('M000 : DECLINE');
    });
    it('transactionStatus must be DECLINED', () => {
      expect(resBody.Payment.TransactionDetail.transactionStatus).toBe('DECLINED');
    });
    it('transactionResultCode must be 000', () => {
      expect(resBody.Payment.TransactionDetail.transactionResultCode).toBe('000');
    });
    it('transactionResultMessage must be Declined', () => {
      expect(resBody.Payment.TransactionDetail.transactionResultMessage).toBe('Declined');
    });
    it('transactionId must be 81b5e0d7dc26', () => {
      expect(resBody.Payment.TransactionDetail.transactionId).toBe('81b5e0d7dc26');
    });
    it('bankMessage must be DECLINE', () => {
      expect(resBody.Payment.TransactionDetail.bankMessage).toBe('DECLINE');
    });
    it('cardIssuerName must be Mastercard', () => {
      expect(resBody.Payment.TransactionDetail.cardIssuerName).toBe('Mastercard');
    });
    it('validityCheck must be undefined', () => {
      expect(resBody.Payment.TransactionDetail.ValidityCheck).toBeUndefined();
    });
  });

  describe('A response with different Validity Check values.', () => {
    beforeAll(() => {
      event = {
        "gatewayResponse": {
          "transactionType": "CHARGE",
          "transactionState": "CAPTURED",
          "transactionOrigin": "ECOM",
          "transactionProcessingDetails": {
            "orderId": "CHG0142e69b20b65f4781a157a3867080052f",
            "transactionTimestamp": "2024-01-24T14:31:51.172783518Z",
            "apiTraceId": "e766bbb464c64117b9d681b5e0d7dc26",
            "clientRequestId": "9178136",
            "transactionId": "e766bbb464c64117b9d681b5e0d7dc26"
          }
        },
        "paymentReceipt": {
          "approvedAmount": {
            "total": 15325,
            "currency": "USD"
          },
          "processorResponseDetails": {
            "approvalStatus": "APPROVED",
            "approvalCode": "OK2217",
            "referenceNumber": "81b5e0d7dc26",
            "processor": "FISERV",
            "host": "NASHVILLE",
            "networkRouted": "MASTERCARD",
            "networkInternationalId": "0001",
            "responseCode": "000",
            "responseMessage": "Approved",
            "hostResponseCode": "00",
            "hostResponseMessage": "APPROVAL",
            "responseIndicators": {
              "alternateRouteDebitIndicator": false,
              "signatureLineIndicator": false,
              "signatureDebitRouteIndicator": false
            },
            "bankAssociationDetails": {
              "associationResponseCode": "M000",
              "avsSecurityCodeResponse": {
                "streetMatch": "MATCHED",
                "postalCodeMatch": "MATCHED",
                "securityCodeMatch": "NOT_CHECKED",
                "association": {
                  "avsCode": "M",
                  "securityCodeResponse": "N"
                }
              }
            },
          }
        },
        "source": {
          "sourceType": "PaymentToken",
          "card": {
            "nameOnCard": "Jessie James",
            "expirationMonth": "12",
            "expirationYear": "2025",
            "bin": "542418",
            "last4": "1732",
            "scheme": "MASTERCARD"
          }
        },
        "billingAddress": {
          "address": {
            "street": "1251 1st Ave",
            "houseNumberOrName": "Suit 1",
            "city": "Chippewa Falls",
            "stateOrProvince": "WI",
            "postalCode": "54729",
            "country": "US"
          }
        },
        "cardDetails": {
          "binSource": "FISERV",
          "recordType": "DETAIL",
          "lowBin": "542418",
          "highBin": "542418",
          "binLength": "06",
          "binDetailPan": "16",
          "issuerBankName": "CITIBANK N.A.",
          "countryCode": "USA",
          "detailedCardProduct": "MASTERCARD",
          "detailedCardIndicator": "CREDIT",
          "pinSignatureCapability": "SIGNATURE",
          "issuerUpdateYear": "22",
          "issuerUpdateMonth": "04",
          "issuerUpdateDay": "22",
          "regulatorIndicator": "NON_REGULATED",
          "cardClass": "CONSUMER",
          "anonymousPrepaidIndicator": "NON_ANONYMOUS",
          "productId": "MPL",
          "accountFundSource": "CREDIT",
          "panLengthMin": "16",
          "panLengthMax": "16",
          "moneySendIndicator": "UNKNOWN"
        },
        "merchantDetails": {
          "tokenType": "LHC0",
          "terminalId": "10000001",
          "merchantId": "100173000000053"
        },
        "transactionDetails": {
          "captureFlag": true,
          "transactionCaptureType": "host",
          "partialApproval": true,
          "processingCode": "000000",
          "merchantOrderId": "45678915",
          "merchantInvoiceNumber": "45678915",
          "primaryTransactionType": "CHARGE_SALE",
          "retrievalReferenceNumber": "81b5e0d7dc26"
        },
      };
      resBody = submitPayment_Response(event)
    });
    it('code must be OK', () => {
      expect(resBody.code).toBe('OK');
    });
    it('message must be M000 : APPROVAL', () => {
      expect(resBody.message).toBe('M000 : APPROVAL');
    });
    it('transactionTag must be e766bbb464c64117b9d681b5e0d7dc26', () => {
      expect(resBody.Payment.TransactionDetail.transactionTag).toBe('e766bbb464c64117b9d681b5e0d7dc26');
    });
    it('transactionStatus must be APPROVED', () => {
      expect(resBody.Payment.TransactionDetail.transactionStatus).toBe('APPROVED');
    });
    it('transactionResultCode must be 000', () => {
      expect(resBody.Payment.TransactionDetail.transactionResultCode).toBe('000');
    });
    it('transactionResultMessage must be Approved', () => {
      expect(resBody.Payment.TransactionDetail.transactionResultMessage).toBe('Approved');
    });
    it('transactionId must be 81b5e0d7dc26', () => {
      expect(resBody.Payment.TransactionDetail.transactionId).toBe('81b5e0d7dc26');
    });
    it('bankMessage must be APPROVAL', () => {
      expect(resBody.Payment.TransactionDetail.bankMessage).toBe('APPROVAL');
    });
    it('cardIssuerName must be Mastercard', () => {
      expect(resBody.Payment.TransactionDetail.cardIssuerName).toBe('Mastercard');
    });
    it('bankCode must be 000', () => {
      expect(resBody.Payment.TransactionDetail.bankCode).toBe('000');
    });
    it('cvvResponseCode must be M', () => {
      expect(resBody.Payment.TransactionDetail.cvvResponseCode).toBe('N');
    });
    it('avsResponseCode must be Y', () => {
      expect(resBody.Payment.TransactionDetail.avsResponseCode).toBe('M');
    });
    it('validityCheck[0] must be PaymentAcceptable', () => {
      expect(resBody.Payment.TransactionDetail.ValidityCheck[0]).toBe('PaymentAcceptable');
    });
    it('validityCheck[1] must be OrderAcceptable', () => {
      expect(resBody.Payment.TransactionDetail.ValidityCheck[1]).toBe('OrderAcceptable');
    });
  });

  describe('A response with an approvalStatus of not in the list, throws error.', () => {
    beforeAll(() => {
      event = {
        "gatewayResponse": {
          "transactionType": "CHARGE",
          "transactionState": "CAPTURED",
          "transactionOrigin": "ECOM",
          "transactionProcessingDetails": {
            "orderId": "CHG0142e69b20b65f4781a157a3867080052f",
            "transactionTimestamp": "2024-01-24T14:31:51.172783518Z",
            "apiTraceId": "e766bbb464c64117b9d681b5e0d7dc26",
            "clientRequestId": "9178136",
            "transactionId": "e766bbb464c64117b9d681b5e0d7dc26"
          }
        },
        "paymentReceipt": {
          "approvedAmount": {
            "total": 15325,
            "currency": "USD"
          },
          "processorResponseDetails": {
            "approvalStatus": "NOT VALID STATUS",
            "approvalCode": "OK2217",
            "referenceNumber": "81b5e0d7dc26",
            "processor": "FISERV",
            "host": "NASHVILLE",
            "networkRouted": "MASTERCARD",
            "networkInternationalId": "0001",
            "responseCode": "000",
            "responseMessage": "Declined",
            "hostResponseCode": "00",
            "hostResponseMessage": "DECLINE",
            "responseIndicators": {
              "alternateRouteDebitIndicator": false,
              "signatureLineIndicator": false,
              "signatureDebitRouteIndicator": false
            },
            "bankAssociationDetails": {
              "associationResponseCode": "M000",
              "avsSecurityCodeResponse": {
                "streetMatch": "MATCHED",
                "postalCodeMatch": "MATCHED",
                "securityCodeMatch": "NOT_CHECKED",
                "association": {
                  "avsCode": "Y",
                  "securityCodeResponse": "M"
                }
              }
            },
          }
        },
        "source": {
          "sourceType": "PaymentToken",
          "card": {
            "nameOnCard": "Jessie James",
            "expirationMonth": "12",
            "expirationYear": "2025",
            "bin": "542418",
            "last4": "1732",
            "scheme": "MASTERCARD"
          }
        },
        "billingAddress": {
          "address": {
            "street": "1251 1st Ave",
            "houseNumberOrName": "Suit 1",
            "city": "Chippewa Falls",
            "stateOrProvince": "WI",
            "postalCode": "54729",
            "country": "US"
          }
        },
        "cardDetails": {
          "detailedCardProduct": "MASTERCARD",
        },
        "merchantDetails": {
          "tokenType": "LHC0",
          "terminalId": "10000001",
          "merchantId": "100173000000053"
        },
        "transactionDetails": {
          "captureFlag": true,
          "transactionCaptureType": "host",
          "partialApproval": true,
          "processingCode": "000000",
          "merchantOrderId": "45678915",
          "merchantInvoiceNumber": "45678915",
          "primaryTransactionType": "CHARGE_SALE",
          "retrievalReferenceNumber": "81b5e0d7dc26"
        },
      };

    });
    test("Must throw new Error('Approval Status not valid'.)", () => {
      function SubmitPayment_Response() {
        submitPayment_Response(event);
      }

      expect(SubmitPayment_Response).toThrow('Approval Status not valid.');
    });
  });
});
