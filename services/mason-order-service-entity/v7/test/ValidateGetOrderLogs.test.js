import { validateRequest } from '../operations/ValidateGetOrderLogs.js';
import { describe, expect, it } from '@jest/globals';

let event;
let resBody;

describe('GetOrderLogs validation suite', () => {
  describe('A complete, valid GetOrderLogs request using orderId', () => {
    beforeAll(() => {
      event = {
        query: {
          orderId: 'ord-1234567890',
          divisionCode: 'AW',
        }
      };
      resBody = validateRequest(event.query)
    });

    it('validationMessage must be empty', () => {
      expect(resBody.validationMessage).toBe('');
    })
  });

  describe('A complete, valid GetOrderLogs request using externalOrderId', () => {
    beforeAll(() => {
      event = {
        query: {
          externalOrderId: 'external-1234567890',
          divisionCode: 'AW',
        }
      };
      resBody = validateRequest(event.query)
    });

    it('validationMessage must be empty', () => {
      expect(resBody.validationMessage).toBe('');
    })
  });

  describe('A incomplete request, missing divisionCode', () => {
    beforeAll(() => {
      event = {
        query: {
          externalOrderId: 'external-1234567890'
        }
      };
      resBody = validateRequest(event.query)
    });

    it('validationMessage must be empty', () => {
      expect(resBody.validationMessage).toBe('Field must exist: divisionCode (querystring)');
    })
  });

  describe('A incomplete request, missing orderId and externalOrderId', () => {
    beforeAll(() => {
      event = {
        query: {
          divisionCode: 'AW'
        }
      };
      resBody = validateRequest(event.query)
    });

    it('validationMessage must be empty', () => {
      expect(resBody.validationMessage).toBe('Field must exist: orderId (querystring) or externalOrderId (querystring)');
    })
  });
});
