import { describe, expect, it } from '@jest/globals';
import { authCreditCard_Response } from '../operations/AuthCreditCard';

let event,resBody, panTokenized;

describe('AuthCreditCard response transformation suite.', () => {
  describe('A complete response transformed from Fiserv Object to Mason CO', () => {
    beforeAll(() => {
      event = {
        "gatewayResponse": {
          "transactionProcessingDetails": {
            "transactionId": "1234567"
          }
        },
        "processorResponseDetails": {
          "approvalStatus": "APPROVED",
          "responseCode": "2468",
          "responseMessage": "Approved",
          "referenceNumber": "1000010000",
          "hostResponseMessage": "Approved",
          "bankAssociationDetails": {
            "associationResponseCode": "M000",
            "avsSecurityCodeResponse": {
              "association": {
                "securityCodeResponse": "M",
                "avsCode": "A"
              }
            }
          },
        },
        "source": {
          "card": {
            "scheme": "VISA"
          }
        },
        "paymentTokens": [
          {
            "tokenData": "green"
          }
        ]
      };
      resBody = authCreditCard_Response(event)
    });
    it('code must be OK', () => {
      expect(resBody.code).toBe('OK');
    });
    it('message must be M000 : Approved', () => {
      expect(resBody.message).toBe('M000 : Approved');
    });
    it('transactionTag must be 1234567', () => {
      expect(resBody.Payment.TransactionDetail.transactionTag).toBe('1234567');
    });
    it('transactionStatus must be APPROVED', () => {
      expect(resBody.Payment.TransactionDetail.transactionStatus).toBe('APPROVED');
    });
    it('transactionResultCode must be 2468', () => {
      expect(resBody.Payment.TransactionDetail.transactionResultCode).toBe('2468');
    });
    it('transactionResultMessage must be Approved', () => {
      expect(resBody.Payment.TransactionDetail.transactionResultMessage).toBe('Approved');
    });
    it('transactionId must be 1000010000', () => {
      expect(resBody.Payment.TransactionDetail.transactionId).toBe('1000010000');
    });
    it('bankMessage must be Approved', () => {
      expect(resBody.Payment.TransactionDetail.bankMessage).toBe('Approved');
    });
    it('cardIssuerName must be Visa', () => {
      expect(resBody.Payment.TransactionDetail.cardIssuerName).toBe('Visa');
    });
    it('panTokenized must be green', () => {
      expect(resBody.Payment.TransactionDetail.panTokenized).toBe('green');
    });
    it('bankCode must be 2468', () => {
      expect(resBody.Payment.TransactionDetail.bankCode).toBe('2468');
    });
    it('cvvResponseCode must be M', () => {
      expect(resBody.Payment.TransactionDetail.cvvResponseCode).toBe('M');
    });
    it('avsResponseCode must be A', () => {
      expect(resBody.Payment.TransactionDetail.avsResponseCode).toBe('A');
    });
    it('ValidityChecks[0] must be PaymentAcceptable', () => {
      expect(resBody.Payment.TransactionDetail.ValidityChecks[0]).toBe('PaymentAcceptable');
    });
    it('ValidityChecks[1] must be OrderAcceptable', () => {
      expect(resBody.Payment.TransactionDetail.ValidityChecks[1]).toBe('OrderAcceptable');
    });
    it('ValidityChecks[2] must be Savable', () => {
      expect(resBody.Payment.TransactionDetail.ValidityChecks[2]).toBe('Savable');
    });
  });

  describe('A response with an approvalStatus of Declined', () => {
    beforeAll(() => {
      event = {
        "gatewayResponse": {
          "transactionProcessingDetails": {
            "transactionId": "1234567"
          }
        },
        "processorResponseDetails": {
          "approvalStatus": "DECLINED",
          "responseCode": "2468",
          "responseMessage": "Declined",
          "referenceNumber": "1000010000",
          "hostResponseMessage": "DECLINED",
          "bankAssociationDetails": {
            "associationResponseCode": "M000",
            "avsSecurityCodeResponse": {
              "association": {
                "securityCodeResponse": "M",
                "avsCode": "A"
              }
            }
          },
        },
        "source": {
          "card": {
            "scheme": "MASTERCARD"
          }
        },
        "paymentTokens": [
          {
            "tokenData": "green"
          }
        ]
      };
      resBody = authCreditCard_Response(event)
    });
    it('code must be OK', () => {
      expect(resBody.code).toBe('OK');
    });
    it('message must be M000 : DECLINED', () => {
      expect(resBody.message).toBe('M000 : DECLINED');
    });
    it('transactionTag must be 1234567', () => {
      expect(resBody.Payment.TransactionDetail.transactionTag).toBe('1234567');
    });
    it('transactionStatus must be DECLINED', () => {
      expect(resBody.Payment.TransactionDetail.transactionStatus).toBe('DECLINED');
    });
    it('transactionResultCode must be 2468', () => {
      expect(resBody.Payment.TransactionDetail.transactionResultCode).toBe('2468');
    });
    it('transactionResultMessage must be Declined', () => {
      expect(resBody.Payment.TransactionDetail.transactionResultMessage).toBe('Declined');
    });
    it('transactionId must be 1000010000', () => {
      expect(resBody.Payment.TransactionDetail.transactionId).toBe('1000010000');
    });
    it('bankMessage must be DECLINED', () => {
      expect(resBody.Payment.TransactionDetail.bankMessage).toBe('DECLINED');
    });
    it('cardIssuerName must be Mastercard', () => {
      expect(resBody.Payment.TransactionDetail.cardIssuerName).toBe('Mastercard');
    });
    it('panTokenized must be green', () => {
      expect(resBody.Payment.TransactionDetail.panTokenized).toBe('green');
    });
    it('bankCode must be 2468', () => {
      expect(resBody.Payment.TransactionDetail.bankCode).toBe('2468');
    });
    it('ValidityChecks must be undefined', () => {
      expect(resBody.Payment.TransactionDetail.ValidityChecks).toBeUndefined();
    });
  });

  describe('A response with different Validity Checks values', ( ) => {
    beforeAll(() => {
      event = {
        "gatewayResponse": {
          "transactionProcessingDetails": {
            "transactionId": "1234567"
          }
        },
        "processorResponseDetails": {
          "approvalStatus": "APPROVED",
          "responseCode": "2468",
          "responseMessage": "Approved",
          "referenceNumber": "1000010000",
          "hostResponseMessage": "Approved",
          "bankAssociationDetails": {
            "associationResponseCode": "M000",
            "avsSecurityCodeResponse": {
              "association": {
                "securityCodeResponse": "N",
                "avsCode": "Z"
              }
            }
          },
        },
        "source": {
          "card": {
            "scheme": "VISA"
          }
        },
        "paymentTokens": [
          {
            "tokenData": "green"
          }
        ]
      };
      resBody = authCreditCard_Response(event)
    });
    it('code must be OK', () => {
      expect(resBody.code).toBe('OK');
    });
    it('message must be M000 : Approved', () => {
      expect(resBody.message).toBe('M000 : Approved');
    });
    it('transactionTag must be 1234567', () => {
      expect(resBody.Payment.TransactionDetail.transactionTag).toBe('1234567');
    });
    it('transactionStatus must be APPROVED', () => {
      expect(resBody.Payment.TransactionDetail.transactionStatus).toBe('APPROVED');
    });
    it('transactionResultCode must be 2468', () => {
      expect(resBody.Payment.TransactionDetail.transactionResultCode).toBe('2468');
    });
    it('transactionResultMessage must be Approved', () => {
      expect(resBody.Payment.TransactionDetail.transactionResultMessage).toBe('Approved');
    });
    it('transactionId must be 1000010000', () => {
      expect(resBody.Payment.TransactionDetail.transactionId).toBe('1000010000');
    });
    it('bankMessage must be Approved', () => {
      expect(resBody.Payment.TransactionDetail.bankMessage).toBe('Approved');
    });
    it('cardIssuerName must be Visa', () => {
      expect(resBody.Payment.TransactionDetail.cardIssuerName).toBe('Visa');
    });
    it('panTokenized must be green', () => {
      expect(resBody.Payment.TransactionDetail.panTokenized).toBe('green');
    });
    it('bankCode must be 2468', () => {
      expect(resBody.Payment.TransactionDetail.bankCode).toBe('2468');
    });
    it('cvvResponseCode must be M', () => {
      expect(resBody.Payment.TransactionDetail.cvvResponseCode).toBe('N');
    });
    it('avsResponseCode must be A', () => {
      expect(resBody.Payment.TransactionDetail.avsResponseCode).toBe('Z');
    });
    it('ValidityChecks[1] must be OrderAcceptable', () => {
      expect(resBody.Payment.TransactionDetail.ValidityChecks[0]).toBe('OrderAcceptable');
    });
  });

  describe('A response with an approvalStatus of not in the list, throw error', ()  => {
    beforeAll(() => {
      event = {
        "gatewayResponse": {
          "transactionProcessingDetails": {
            "transactionId": "1234567"
          }
        },
        "processorResponseDetails": {
          "approvalStatus": "NOT VALID STATUS",
          "responseCode": "2468",
          "responseMessage": "Approved",
          "referenceNumber": "1000010000",
          "hostResponseMessage": "Approved",
          "bankAssociationDetails": {
            "associationResponseCode": "M000",
            "avsSecurityCodeResponse": {
              "association": {
                "securityCodeResponse": "M",
                "avsCode": "A"
              }
            }
          },
        },
        "source": {
          "card": {
            "scheme": "VISA"
          }
        },
        "paymentTokens": [
          {
            "tokenData": "green"
          }
        ]
      };

    });
    test("Must throw new Error('Approval Status not valid'.)", () => {
      function AuthCreditCard_Response() {
        authCreditCard_Response(event);
      }

      expect(AuthCreditCard_Response).toThrow('Approval Status not valid.');
    });
  });
});




