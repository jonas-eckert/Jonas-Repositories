import { describe, expect, it } from '@jest/globals';
import { getOrderLogsUtilReq } from '../operations/GetOrderLogs.js';
import xml2js from 'xml2js';

describe('GetOrderLogs request transformation suite.', () => {
  describe('A complete request transformed to XML from JSON.', () => {
    it('Should correctly transform a JSON request to XML using orderId', () => {
      //Mason Payload
      let inBody = {
        event: {},
        query: {
          divisionCode: 'ZY',
          orderId: '1234567890',
        },
      };

      //Expected Advantage payload
      let expectedPayload = {
        OrderLog_v1: {
          order_no: 1234567890,
          title: 'ZY',
        },
      };
      let builder = new xml2js.Builder();
      let expectedXML = builder.buildObject(expectedPayload);

      let mappedBody = getOrderLogsUtilReq(inBody.event, inBody.query);

      // Jest Assertion
      expect(mappedBody).toEqual(expectedXML);
    });
  });

  describe('A complete request transformed to JSON from XML.', () => {
    it('Should correctly transform a JSON request to XML using externalOrderId', () => {
      //OracleData
      let inBody = {
        event: {},
        query: {
          divisionCode: 'AW',
          externalOrderId: '987654321'
        },
      };

      //ExpectedMasonData
      let payload = {
        OrderLog_v1: {
          title: 'AW',
          generic_order_no: 987654321,
        },
      };
      let builder = new xml2js.Builder();
      let expectedXML = builder.buildObject(payload);

      let mappedBody = getOrderLogsUtilReq(inBody.event, inBody.query);

      // Jest Assertion
      expect(mappedBody).toEqual(expectedXML);
    });
  });
});
