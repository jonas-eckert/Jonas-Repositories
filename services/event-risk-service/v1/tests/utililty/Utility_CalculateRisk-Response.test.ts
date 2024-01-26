import { beforeAll, describe, expect, it } from '@jest/globals';
import { IMasonResponse } from '../../definitions/MasonEventRiskDef';
import { IAccertifyResponse } from '../../definitions/AccertifyEventRiskDef';
import { mapAccertifyToMason } from '../../operations/utility/calculate-risk';

let inBody: IAccertifyResponse = {};
let mappedBody: IMasonResponse = {};
let expectedData: IMasonResponse = {};

describe('CalculateRisk Utility Response Transformation Suite', () => {
  describe('Detailed high risk response', () => {
    it('should correctly map Accertify object to Mason CO.', () => {
      //input to be mapped
      inBody = {
        status: true,
        eventID: 'f467d441-29bc-4be0-b40e-c3b247d68fa2',
        messages: {
          error: [],
          warning: [],
          info: [
            'debug logging is enabled',
            'duration to process transaction: 200 ms',
          ],
        },
        eventDetails: {
          deviceDetails: {
            deviceIDConfidence: 99,
            deviceIDFirstSeen: '1634064122326',
            deviceID: '123456',
            deviceIDNew: false,
            deviceIDTimesSeen: 2,
          },
        },
        results: {
          riskScore: {
            score: 88,
            reasonCodes: {
              riskFactors: ['Device Reputation', 'Connection History'],
              trustFactors: ['Email History', 'Email Reputation'],
            },
            insights: ['emailAliased', 'suspectedBot'],
          },
          listHits: {
            negativeValues: [
              {
                type: 'IP Address',
                fieldName: 'realIpAddress',
                value: '128.210.79.50',
                created: '1580852422000',
                timesHit: 13,
                lastSeen: '1580853495000',
              },
              {
                type: 'IP Address',
                fieldName: 'ipAddress',
                value: '127.0.0.1',
                created: '1580852423000',
                timesHit: 14,
                lastSeen: '1580853496000',
              },
            ],
            positiveValues: [
              {
                type: 'Email Address',
                fieldName: 'emailAddress',
                value: 'joe@no.tld',
                created: '1580852424000',
                timesHit: 89,
                lastSeen: '1580853497000',
              },
            ],
          },
        },
      };

      //ExpectedData
      expectedData = {
        RiskResult: {
          eventId: 'f467d441-29bc-4be0-b40e-c3b247d68fa2',
          score: 88,
          TrustFactors: ['Email History', 'Email Reputation'],
          RiskFactors: ['Device Reputation', 'Connection History'],
          Insights: ['emailAliased', 'suspectedBot'],
          nextAction : "ProceedNormally",
          NegativeHits: [
            {
              name: 'realIpAddress',
              type: 'IP Address',
              value: '128.210.79.50',
              createdOn: '2020-02-04T21:40:22.000Z',
              lastSeenOn: '2020-02-04T21:58:15.000Z',
              timesHit: 13,
            },
            {
              name: 'ipAddress',
              type: 'IP Address',
              value: '127.0.0.1',
              createdOn: '2020-02-04T21:40:23.000Z',
              lastSeenOn: '2020-02-04T21:58:16.000Z',
              timesHit: 14,
            },
          ],
          PositiveHits: [
            {
              name: 'emailAddress',
              type: 'Email Address',
              value: 'joe@no.tld',
              createdOn: '2020-02-04T21:40:24.000Z',
              lastSeenOn: '2020-02-04T21:58:17.000Z',
              timesHit: 89,
            },
          ],
          DeviceDetail: {
            deviceIdConfidence: '99',
            deviceIdFirstSeenOn: '2021-10-12T18:42:02.326Z',
            deviceId: '123456',
            deviceIdTimesSeen: 2,
          },
          Messages: [
            {
              severity: 'info',
              text: 'debug logging is enabled',
            },
            {
              severity: 'info',
              text: 'duration to process transaction: 200 ms',
            },
          ],
        },
        code: 'OK',
      };

      mappedBody = mapAccertifyToMason(inBody);

      // Jest Assertion
      expect(mappedBody).toEqual(expectedData);
    });
  });

  describe('Basic low risk response', () => {
    it('should correctly map Accertify object to Mason CO.', () => {
      //input to be mapped
      inBody = {
        status: true,
        eventID: 'f467d441-29bc-4be0-b40e-c3b247d68fa2',
        messages: {
          error: [],
          warning: [],
          info: [],
        },
        results: {
          riskScore: {
            score: 6,
            reasonCodes: {
              riskFactors: [],
              trustFactors: ['Device Reputation'],
            },
          },
          listHits: {
            negativeValues: [],
            positiveValues: [],
          },
        },
      };

      //ExpectedData
      expectedData = {
        RiskResult: {
          eventId: 'f467d441-29bc-4be0-b40e-c3b247d68fa2',
          nextAction : "ProceedNormally",
          score: 6,
          TrustFactors: ['Device Reputation'],
          NegativeHits: [],
          PositiveHits: [],
          Messages: [],
        },
        code: 'OK',
      };

      mappedBody = mapAccertifyToMason(inBody);

      // Jest Assertion
      expect(mappedBody).toEqual(expectedData);
    });

    describe('A basic low risk response that contains a demographics warning', () => {
      beforeAll(() => {
        inBody = {
          status: true,
          eventID: 'f467d441-29bc-4be0-b40e-c3b247d68fa2',
          messages: {
            error: [],
            warning: ['Could not reach demographics system'],
            info: [],
          },
          results: {
            riskScore: {
              score: 6,
              reasonCodes: {
                riskFactors: [],
                trustFactors: ['Device Reputation'],
              },
            },
            listHits: {
              negativeValues: [],
              positiveValues: [],
            },
          },
        };
        mappedBody = mapAccertifyToMason(inBody);
      });
      it('must have first message severity of warning', () => {
        expect(mappedBody.RiskResult!.Messages![0].severity).toBe('warning');
      });
      it("must have first message text of 'Could not reach demographics system'", () => {
        expect(mappedBody.RiskResult!.Messages![0].text).toBe(
          'Could not reach demographics system',
        );
      });
    });
  });

  describe('An error response', () => {
    beforeAll(() => {
      inBody = {
        status: false,
        eventID: 'f467d441-29bc-4be0-b40e-c3b247d68fa2',
        messages: {
          error: ['Fatal Error', 'Backend system unreachable'],
          warning: [],
          info: [],
        },
      };
      mappedBody = mapAccertifyToMason(inBody);
    });

    // messages
    it('must have 2 risk result messages', () => {
      expect(mappedBody.RiskResult!.Messages!.length).toBe(2);
    });
    it('must have first message severity of error', () => {
      expect(mappedBody.RiskResult!.Messages![0].severity).toBe('error');
    });
    it("must have first message text of 'Fatal Error'", () => {
      expect(mappedBody.RiskResult!.Messages![0].text).toBe('Fatal Error');
    });
    it('must have second message severity of error', () => {
      expect(mappedBody.RiskResult!.Messages![1].severity).toBe('error');
    });
    it("must have second message text of 'Backend system unreachable'", () => {
      expect(mappedBody.RiskResult!.Messages![1].text).toBe(
        'Backend system unreachable',
      );
    });
  });
});
