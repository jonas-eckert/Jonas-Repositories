import { describe, expect, it } from '@jest/globals';
import { getOrderLogsUtilRes } from '../operations/GetOrderLogs.js';
import xml2js from 'xml2js';

describe('GetOrderLogs response transformation suite.', () => {
  describe('A complete response transformed to JSON from XML.', () => {
    it('Should correctly transform an XML request to JSON.', () => {
      //Advantage Payload
      let inBody =
      '<OrderLog_v1Response>\
        <Order>\
          <order_no>1122334455</order_no>\
          <Details>\
            <Detail>\
              <seq>2</seq>\
              <moddt>2023-10-20T01:02:03.082</moddt>\
              <modby>WEB</modby>\
              <prgram>ORDOUT</prgram>\
              <event>Flag Changed</event>\
              <data1>From 1-Valid</data1>\
              <data2>To 5-Selected</data2>\
            </Detail>\
            <Detail>\
              <seq>1</seq>\
              <moddt>2023-10-20T01:02:03.000</moddt>\
              <modby>WEB</modby>\
              <prgram>MEMSLP</prgram>\
              <event>Order Created</event>\
              <data1>Line:  1</data1>\
              <data2>Net Amt  $53.64</data2>\
            </Detail>\
          </Details>\
        </Order>\
        <CommandStatus>\
            <code>OK</code>\
            <text>Success</text>\
            <connector>unknown</connector>\
            <duration>0.000</duration>\
            <Times>\
              <submitted>20231117094324.299</submitted>\
              <completed>20231117094324.299</completed>\
            </Times>\
          </CommandStatus>\
      </OrderLog_v1Response>';

      let expectedPayload = {
        orderId: '1122334455',
        code: 'OK',
        message: 'Success',
        Logs: [
          {
            sequence: '2',
            updatedOn: '2023-10-20T01:02:03.082',
            updatedBy: 'WEB',
            program: 'ORDOUT',
            event: 'Flag Changed',
            oldStatus: 'From 1-Valid',
            newStatus: 'To 5-Selected',
          },
          {
            sequence: '1',
            updatedOn: '2023-10-20T01:02:03.000',
            updatedBy: 'WEB',
            program: 'MEMSLP',
            event: 'Order Created',
            oldStatus: 'Line:  1',
            newStatus: 'Net Amt  $53.64',
          },
        ],
      };

      let parsedXML;
      let parser = new xml2js.Parser({explicitArray: false});
      parser.parseString(inBody, (err,result) => {
        parsedXML = result;
      });

      let mappedBody = getOrderLogsUtilRes(parsedXML);

      //Jest Assertion
      expect(mappedBody).toEqual(expectedPayload);
    });
  });
});
