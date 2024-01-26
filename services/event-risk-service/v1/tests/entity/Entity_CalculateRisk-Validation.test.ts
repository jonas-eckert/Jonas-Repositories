import { IMasonRequest } from '../../definitions/MasonEventRiskDef';
import { validateRequest } from '../../operations/entity/calculate-risk';
import { afterAll, beforeAll, describe, expect, it } from '@jest/globals';

let inBody: IMasonRequest = {};
let mappedBody: any = {};

describe('CalculateRisk-Entity Validation Unit Tests Suite', () => {
  describe('A complete login request', () => {
    beforeAll(() => {
      inBody = {
        eventType: 'login',
        eventSource: 'agentStore',
        BaseParameters: {
          ipAddress: '10.11.12.13',
          userAgent:
            'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.61 Safari/537.36',
          deviceTransactionId: 'dti-123',
          ubaId: 'ubai-123',
          ubaEvents: 'ubae-123',
          isSuccess: true,
        },
        Customer: {
          DivisionCustomers: [
            {
              DivisionCustomerInfo: {
                webAccountId: 'u123456789',
              },
            },
          ],
          EmailRecords: [
            {
              EmailInfo: {
                emailAddress: 'lskywalker@rebelbase.net',
              },
            },
          ],
        },
      };
      mappedBody = validateRequest(inBody);
    });

    it('validationMessage must be empty', () => {
      expect(mappedBody.validationMessage).toBe('');
    });
  });

  describe('A invalid request missing eventType', () => {
    beforeAll(() => {
      delete inBody.eventType;
      mappedBody = validateRequest(inBody);
    });

    it('validationMessage must be empty', () => {
      expect(mappedBody.validationMessage).toBe('An eventType must exist.');
    });
    afterAll(() => {
      inBody.eventType = 'unknownEvent';
    });
  });

  describe('A invalid request because of an invalid eventType', () => {
    beforeAll(() => {
      mappedBody = validateRequest(inBody);
    });

    it('validationMessage must not be valid.', () => {
      expect(mappedBody.validationMessage).toBe(
        'Eventtype ' + inBody.eventType + ' is not valid.',
      );
    });
    afterAll(() => {
      inBody.eventType = 'login';
    });
  });

  describe('A invalid request missing eventSource', () => {
    beforeAll(() => {
      delete inBody.eventSource;
      mappedBody = validateRequest(inBody);
    });

    it('validationMessage must not be valid.', () => {
      expect(mappedBody.validationMessage).toBe('Eventsource must exist.');
    });
    afterAll(() => {
      inBody.eventSource = 'agentStore';
    });
  });

  describe('A login request that is missing isSuccess', () => {
    beforeAll(() => {
      delete inBody.BaseParameters!.isSuccess;
      mappedBody = validateRequest(inBody);
    });

    it('validationMessage must be isSuccess must exist when eventType is login.', () => {
      expect(mappedBody.validationMessage).toBe(
        'isSuccess must exist when eventType is login.',
      );
    });
    afterAll(() => {
      inBody.BaseParameters!.isSuccess = false;
    });
  });

  describe('A login request where isSuccess is false.', () => {
    beforeAll(() => {
      mappedBody = validateRequest(inBody);
    });

    it('validationMessage must be empty', () => {
      expect(mappedBody.validationMessage).toBe('');
    });
  });

  describe('A complete logout request', () => {
    beforeAll(() => {
      inBody = {
        eventType: 'logout',
        eventSource: 'agentStore',
        BaseParameters: {
          ubaId: 'ubai-123',
          ubaEvents: 'ubae-123',
        },
        Customer: {
          DivisionCustomers: [
            {
              DivisionCustomerInfo: {
                webAccountId: 'u123456789',
              },
            },
          ],
          EmailRecords: [
            {
              EmailInfo: {
                emailAddress: 'lskywalker@rebelbase.net',
              },
            },
          ],
        },
      };
      mappedBody = validateRequest(inBody);
    });

    it('validationMessage must be empty', () => {
      expect(mappedBody.validationMessage).toBe('');
    });
  });

  describe('A logout request that is missing webAccountId', () => {
    beforeAll(() => {
      delete inBody.Customer!.DivisionCustomers![0].DivisionCustomerInfo!
        .webAccountId;
      mappedBody = validateRequest(inBody);
    });

    it('validationMessage must be webAccountId must exist when eventType is logout.', () => {
      expect(mappedBody.validationMessage).toBe(
        'webAccountId must exist when eventType is logout.',
      );
    });
  });

  describe('A complete accountCreate request', () => {
    beforeAll(() => {
      inBody = {
        eventType: 'accountCreate',
        eventSource: 'agentStore',
        BaseParameters: {
          ipAddress: '10.11.12.13',
          userAgent:
            'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.61 Safari/537.36',
          deviceTransactionId: 'dti-123',
          ubaId: 'ubai-123',
          ubaEvents: 'ubae-123',
          isSuccess: true,
        },
        Customer: {
          CustomerInfo: {
            firstName: 'Luke',
            lastName: 'Skywalker',
          },
          DivisionCustomers: [
            {
              DivisionCustomerInfo: {
                webAccountId: 'u123456789',
              },
            },
          ],
          EmailRecords: [
            {
              EmailInfo: {
                emailAddress: 'lskywalker@rebelbase.net',
              },
            },
          ],
        },
      };
      mappedBody = validateRequest(inBody);
    });

    it('validationMessage must be empty', () => {
      expect(mappedBody.validationMessage).toBe('');
    });
  });

  describe('An accountCreate request that is missing isSuccess', () => {
    beforeAll(() => {
      delete inBody.BaseParameters!.isSuccess;
      mappedBody = validateRequest(inBody);
    });

    it('validationMessage must be isSuccess must exist when eventType is accountCreate.', () => {
      expect(mappedBody.validationMessage).toBe(
        'isSuccess must exist when eventType is accountCreate.',
      );
    });
  });

  describe('A accountUpdate request missing webAccountId', () => {
    beforeAll(() => {
      inBody = {
        eventType: 'accountUpdate',
        eventSource: 'agentStore',
        BaseParameters: {
          ipAddress: '10.11.12.13',
          userAgent:
            'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.61 Safari/537.36',
          deviceTransactionId: 'dti-123',
          ubaId: 'ubai-123',
          ubaEvents: 'ubae-123',
        },
        Customer: {
          CustomerInfo: {
            firstName: 'Luke',
            lastName: 'Skywalker',
          },
          DivisionCustomers: [
            {
              DivisionCustomerInfo: {
                // 'webAccountId': 'u123456789'
              },
            },
          ],
          EmailRecords: [
            {
              EmailInfo: {
                emailAddress: 'lskywalker@rebelbase.net',
              },
            },
          ],
        },
      };
      mappedBody = validateRequest(inBody);
    });

    it('validationMessage must be webAccountId must exist when eventType is accountUpdate.', () => {
      expect(mappedBody.validationMessage).toBe(
        'webAccountId must exist when eventType is accountUpdate.',
      );
    });
  });

  describe('A complete passwordForgotUpdate request', () => {
    beforeAll(() => {
      inBody = {
        eventType: 'passwordForgotUpdate',
        eventSource: 'agentStore',
        BaseParameters: {
          ipAddress: '10.11.12.13',
          userAgent:
            'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.61 Safari/537.36',
          deviceTransactionId: 'dti-123',
          ubaId: 'ubai-123',
          ubaEvents: 'ubae-123',
          updateTrigger: 'customerInitiated',
        },
        Customer: {
          DivisionCustomers: [
            {
              DivisionCustomerInfo: {
                webAccountId: 'u123456789',
              },
            },
          ],
          EmailRecords: [
            {
              EmailInfo: {
                emailAddress: 'lskywalker@rebelbase.net',
              },
            },
          ],
        },
      };
      mappedBody = validateRequest(inBody);
    });

    it('validationMessage must be empty', () => {
      expect(mappedBody.validationMessage).toBe('');
    });
  });

  describe('An invalid passwordForgotUpdate request, missing updateTrigger', () => {
    beforeAll(() => {
      delete inBody.BaseParameters!.updateTrigger;
      mappedBody = validateRequest(inBody);
    });

    it('validationMessage must be updateTrigger must exist when eventType is passwordForgotUpdate.', () => {
      expect(mappedBody.validationMessage).toBe(
        'updateTrigger must exist when eventType is passwordForgotUpdate.',
      );
    });
    afterAll(() => {
      inBody.BaseParameters!.updateTrigger = 'customerInitiated';
    });
  });

  describe('An invalid passwordForgotUpdate request, missing webAccountId', () => {
    beforeAll(() => {
      delete inBody.Customer!.DivisionCustomers![0].DivisionCustomerInfo!
        .webAccountId;
      mappedBody = validateRequest(inBody);
    });

    it('validationMessage must be webAccountId must exist when eventType is passwordForgotUpdate.', () => {
      expect(mappedBody.validationMessage).toBe(
        'webAccountId must exist when eventType is passwordForgotUpdate.',
      );
    });
  });

  describe('A complete payment request with mason credit.', () => {
    beforeAll(() => {
      inBody = {
        eventType: 'payment',
        eventSource: 'agentStore',
        BaseParameters: {
          ipAddress: '10.11.12.13',
          userAgent:
            'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.61 Safari/537.36',
          deviceTransactionId: 'dti-123',
          ubaId: 'ubai-123',
          ubaEvents: 'ubae-123',
          transactionId: 'trx-123',
          paymentAmount: 123.45,
          currencyCode: 'USD',
          isSuccess: true,
        },
        Customer: {
          BillingAddress: {
            HeaderInfo: {
              isPrimary: true,
            },
            PersonInfo: {
              firstName: 'Luke',
              lastName: 'Skywalker',
            },
            LocationInfo: {
              phoneNumber: '555-123-4567',
              line1: '123 Main St',
              city: 'Chippewa Falls',
              state: 'WI',
              zip: '54729',
              country: 'US',
            },
          },
          EmailRecords: [
            {
              EmailInfo: {
                emailAddress: 'lskywalker@rebelbase.net',
              },
            },
          ],
        },
        Payments: [
          {
            PaymentInfo: {
              paymentType: 'MasonCredit',
            },
          },
        ],
      };
      mappedBody = validateRequest(inBody);
    });

    it('validationMessage must be empty', () => {
      expect(mappedBody.validationMessage).toBe('');
    });
  });

  describe('A payment request that is missing transactionId', () => {
    beforeAll(() => {
      delete inBody.BaseParameters!.transactionId;
      mappedBody = validateRequest(inBody);
    });

    it('validationMessage must be transactionId must exist when eventType is payment.', () => {
      expect(mappedBody.validationMessage).toBe(
        'transactionId must exist when eventType is payment.',
      );
    });
    afterAll(() => {
      inBody.BaseParameters!.transactionId = 'trx-123';
    });
  });

  describe('A payment request that is missing paymentAmount', () => {
    beforeAll(() => {
      delete inBody.BaseParameters!.paymentAmount;
      mappedBody = validateRequest(inBody);
    });

    it('validationMessage must be paymentAmount must exist when eventType is payment.', () => {
      expect(mappedBody.validationMessage).toBe(
        'paymentAmount must exist when eventType is payment.',
      );
    });
    afterAll(() => {
      inBody.BaseParameters!.paymentAmount = 123.45;
    });
  });

  describe('A payment request that is missing currencyCode', () => {
    beforeAll(() => {
      delete inBody.BaseParameters!.currencyCode;
      mappedBody = validateRequest(inBody);
    });

    it('validationMessage must be currencyCode must exist when eventType is payment.', () => {
      expect(mappedBody.validationMessage).toBe(
        'currencyCode must exist when eventType is payment.',
      );
    });
    afterAll(() => {
      inBody.BaseParameters!.currencyCode = 'USD';
    });
  });

  describe('A payment request that is missing isSuccess', () => {
    beforeAll(() => {
      delete inBody.BaseParameters!.isSuccess;
      mappedBody = validateRequest(inBody);
    });

    it('validationMessage must be isSuccess must exist when eventType is payment.', () => {
      expect(mappedBody.validationMessage).toBe(
        'isSuccess must exist when eventType is payment.',
      );
    });
  });

  describe('A complete verification request.', () => {
    beforeAll(() => {
      inBody = {
        eventType: 'verification',
        eventSource: 'agentStore',
        BaseParameters: {
          ipAddress: '10.11.12.13',
          userAgent:
            'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.61 Safari/537.36',
          deviceTransactionId: 'dti-123',
          ubaId: 'ubai-123',
          ubaEvents: 'ubae-123',
          updateTrigger: 'customerInitiated',
          updateEventId: 'updateEventId',
          verificationType: 'other',
          verificationStatus: 'success',
        },
        Customer: {
          DivisionCustomers: [
            {
              DivisionCustomerInfo: {
                webAccountId: 'u123456789',
              },
            },
          ],
          EmailRecords: [
            {
              EmailInfo: {
                emailAddress: 'lskywalker@rebelbase.net',
              },
            },
          ],
        },
      };
      mappedBody = validateRequest(inBody);
    });

    it('validationMessage must be empty', () => {
      expect(mappedBody.validationMessage).toBe('');
    });
  });

  describe('A verification request with missing webAccountId', () => {
    beforeAll(() => {
      delete inBody.Customer!.DivisionCustomers![0].DivisionCustomerInfo!
        .webAccountId;
      mappedBody = validateRequest(inBody);
    });

    it('validationMessage must be webAccountId must exist when eventType is verification.', () => {
      expect(mappedBody.validationMessage).toBe(
        'webAccountId must exist when eventType is verification.',
      );
    });
    afterAll(() => {
      inBody.Customer!.DivisionCustomers![0].DivisionCustomerInfo!.webAccountId =
        'u123456789';
    });
  });

  describe('A verification request with missing updateEventId', () => {
    beforeAll(() => {
      delete inBody.BaseParameters!.updateEventId;
      mappedBody = validateRequest(inBody);
    });

    it('validationMessage must be updateEventId must exist when eventType is verification.', () => {
      expect(mappedBody.validationMessage).toBe(
        'updateEventId must exist when eventType is verification.',
      );
    });
    afterAll(() => {
      inBody.BaseParameters!.updateEventId = 'updateEventId';
    });
  });

  describe('A verification request with an invalid verificationType', () => {
    beforeAll(() => {
      inBody.BaseParameters!.verificationType = 'invalidType';
      mappedBody = validateRequest(inBody);
    });

    it('validationMessage must be VerificationType invalideType is not valid.', () => {
      expect(mappedBody.validationMessage).toBe(
        'VerificationType invalidType is not valid.',
      );
    });
    afterAll(() => {
      inBody.BaseParameters!.verificationType = 'appPush';
    });
  });

  describe('A verification request with an invalid verificationStatus', () => {
    beforeAll(() => {
      inBody.BaseParameters!.verificationStatus = 'invalidType';
      mappedBody = validateRequest(inBody);
    });

    it('validationMessage must be VerificationStatus invalidType is not valid.', () => {
      expect(mappedBody.validationMessage).toBe(
        'VerificationStatus invalidType is not valid.',
      );
    });
  });
});
