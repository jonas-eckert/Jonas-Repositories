import { describe, expect, it } from '@jest/globals';
import { IMasonResponse } from '../../definitions/MasonEventRiskDef';
import { IOracleResponse } from '../../definitions/OracleEventRiskDef';
import { mapMasonToOracle } from '../../operations/task/calculate-risk';

let inBody: IMasonResponse = {};
let mappedBody: IOracleResponse = {};
let expectedMasonData: IOracleResponse = {};

describe('CalculateRisk-Task Response Transformation Suite', () => {
  describe('A detailed high risk response', () => {
    it('should correctly map Mason CO response to Oracle object response for eventType of login', () => {
      //input
      inBody = {
        code: 'OK',
        RiskResult: {
          eventId: 'f467d441-29bc-4be0-b40e-c3b247d68fa2',
          score: 88,
          recommendationCode: 'recCode',
          recommendationDetail: 'detail about code',
          nextAction: 'ProceedNormally',
          TrustFactors: ['Email History', 'Email Reputation'],
          Messages: [],
          RiskFactors: ['Device Reputation', 'Connection History'],
          PositiveHits: [
            {
              lastSeenOn: '2020-02-04T21:58:15.000Z',
              name: 'emailAddress',
              timesHit: 89,
              type: 'Email Address',
              value: 'joe@no.tld',
              createdOn: '2020-02-04T21:40:22.000Z',
            },
          ],
          NegativeHits: [
            {
              lastSeenOn: '2020-02-04T21:58:15.000Z',
              name: 'realIpAddress',
              timesHit: 13,
              type: 'IP Address',
              value: '128.210.79.50',
              createdOn: '2020-02-04T21:40:22.000Z',
            },
            {
              lastSeenOn: '2020-02-04T21:58:15.000Z',
              name: 'ipAddress',
              timesHit: 13,
              type: 'IP Address',
              value: '127.0.0.1',
              createdOn: '2020-02-04T21:40:22.000Z',
            },
          ],
        },
      };

      //expected output
      expectedMasonData = {
        code: 'OK',
        eventId: 'f467d441-29bc-4be0-b40e-c3b247d68fa2',
        score: '88',
        recommendationCode: 'recCode',
        recommendationDetail: 'detail about code',
        nextAction: 'ProceedNormally',
        trustFactors: ['Email History', 'Email Reputation'],
        riskFactors: ['Device Reputation', 'Connection History'],
      };

      mappedBody = mapMasonToOracle(inBody);

      // Jest Assertion
      expect(mappedBody).toEqual(expectedMasonData);
    });
  });

  describe('A detailed high risk response', () => {
    it('A detailed high risk response with TrustFactors, RiskFactors, Insights, and DeviceDetail', () => {
      //input
      inBody = {
        code: 'OK',
        message: 'string',
        debugMessage: 'string',
        RiskResult: {
          eventId: 'f467d441-29bc-4be0-b40e-c3b247d68fa2',
          score: 5,
          nextAction: 'ProceedNormally',
          RiskFactors: ['Email Intelligence', 'Connection Activity'],
          TrustFactors: ['Connection Activity', 'Device Intelligence'],
          Insights: ['emailAliased'],
          NegativeHits: [
            {
              value: 'string',
              createdOn: '2021-10-13T19:38:27.476Z',
              lastSeenOn: '2021-10-13T19:38:27.476Z',
              timesHit: 0,
            },
          ],
          PositiveHits: [
            {
              value: 'string',
              createdOn: '2021-10-13T19:38:27.476Z',
              lastSeenOn: '2021-10-13T19:38:27.476Z',
              timesHit: 0,
            },
          ],
          DeviceDetail: {
            deviceIdConfidence: '99',
            deviceIdFirstSeenOn: '2021-10-13T19:38:27.476Z',
            deviceId: '123456',
            isNewDeviceId: false,
            deviceIdTimesSeen: 2,
          },
        },
      };

      //expected output
      expectedMasonData = {
        code: 'OK',
        message: 'string',
        debugMessage: 'string',
        eventId: 'f467d441-29bc-4be0-b40e-c3b247d68fa2',
        score: '5',
        nextAction: 'ProceedNormally',
        trustFactors: ['Connection Activity', 'Device Intelligence'],
        riskFactors: ['Email Intelligence', 'Connection Activity'],
        insights: ['emailAliased'],
        DeviceDetail:{
          "deviceIdConfidence":"99",
          "deviceIdFirstSeenOn": "2021-10-13T19:38:27.476Z",
          "deviceId": "123456",
          "isNewDeviceId": false,
          "deviceIdTimesSeen": 2
      }
      };

      mappedBody = mapMasonToOracle(inBody);

      // Jest Assertion
      expect(mappedBody).toEqual(expectedMasonData);
    });
  });
});
