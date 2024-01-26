import { beforeAll, describe, expect, it } from '@jest/globals';
import { IMasonRequest } from '../../definitions/MasonEventRiskDef';
import { IAccertifyRequest } from '../../definitions/AccertifyEventRiskDef';
import { mapMasonToAccertify } from '../../operations/utility/calculate-risk';

let inBody: IMasonRequest = {};
let mappedBody: IAccertifyRequest = {};
let expectedData: IAccertifyRequest = {};

describe('CalculateRisk Utility Request Transformation Suite', () => {
  describe('Eventtype of login', () => {
    it('should correctly map Mason CO Accertify object for request eventType of login', () => {
      //input to be mapped
      inBody = {
        eventType: 'login',
        eventSource: 'agentStore',
        divisionCode: 'SM',
        BaseParameters: {
          returnScore: true,
          ipAddress: '10.11.12.13',
          userAgent:
            'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.61 Safari/537.36',
          deviceTransactionId: 'dti-123',
          ubaId: 'ubai-123',
          ubaEvents: 'ubae-123',
          isSuccess: true,
          ubaSessionId: 'wsi-123',
          accountStatus: 'good',
          password: 'pass123',
          hashedPassword: '9KQG4Gp4t7GhNV23',
          lastPasswordChangeDate: '2020-01-01',
          latitude: '58.99993333',
          longitude: '58.99993334',
          pageId: 'pag-123',
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

      //ExpectedData
      expectedData = {
        eventSource: 'agentStore',
        brand: 'SM',
        success: 'true',
        ipAddress: '10.11.12.13',
        userAgent:
          'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.61 Safari/537.36',
        deviceTransactionID: 'dti-123',
        ubaID: 'ubai-123',
        ubaEvents: 'ubae-123',
        ubaSessionId: 'wsi-123',
        accountStatus: 'good',
        password: 'pass123',
        hashedPassword: '9KQG4Gp4t7GhNV23',
        lastPasswordChangeDate: '2020-01-01',
        returnScore: true,
        latitude: '58.99993333',
        longitude: '58.99993334',
        pageID: 'pag-123',
        firstName: 'Luke',
        lastName: 'Skywalker',
        accountID: 'u123456789',
        emailAddress: 'lskywalker@rebelbase.net',
        username: 'lskywalker@rebelbase.net',
      };

      mappedBody = mapMasonToAccertify(inBody);

      // Jest Assertion
      expect(mappedBody).toEqual(expectedData);
    });
  });
  describe('Eventtype of logout', () => {
    it('should correctly map Mason CO Accertify object for request eventType of logout', () => {
      //input to be mapped
      inBody = {
        eventType: 'logout',
        eventSource: 'web',
        divisionCode: 'SM',
        BaseParameters: {
          returnScore: true,
          ipAddress: '10.11.12.13',
          userAgent:
            'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.61 Safari/537.36',
          deviceTransactionId: 'dti-123',
          ubaId: 'ubai-123',
          ubaEvents: 'ubae-123',
          isSuccess: true,
          ubaSessionId: 'wsi-123',
          accountStatus: 'good',
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

      //ExpectedData
      expectedData = {
        eventSource: 'web',
        brand: 'SM',
        success: 'true',
        ipAddress: '10.11.12.13',
        userAgent:
          'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.61 Safari/537.36',
        deviceTransactionID: 'dti-123',
        ubaID: 'ubai-123',
        ubaEvents: 'ubae-123',
        ubaSessionId: 'wsi-123',
        accountStatus: 'good',
        returnScore: true,
      };

      mappedBody = mapMasonToAccertify(inBody);

      // Jest Assertion
      expect(mappedBody).toEqual(expectedData);
    });
  });
  describe('Eventtype of accountCreate', () => {
    describe('a complete accountCreate request', () => {
      beforeAll(() => {
        inBody = {
          eventType: 'accountCreate',
          eventSource: 'web',
          divisionCode: 'SM',
          BaseParameters: {
            returnScore: true,
            ipAddress: '10.11.12.13',
            userAgent:
              'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.61 Safari/537.36',
            deviceTransactionId: 'dti-123',
            ubaId: 'ubai-123',
            ubaEvents: 'ubae-123',
            isSuccess: true,
            ubaSessionId: 'wsi-123',
            accountStatus: 'good',
          },
          Customer: {
            CustomerInfo: {
              firstName: 'Luke',
              lastName: 'Skywalker',
              dob: '1990-01-01',
              gender: 'M',
            },
            DivisionCustomers: [
              {
                DivisionCustomerInfo: {
                  webAccountId: 'u123456789',
                },
              },
            ],
            BillingAddress: {
              HeaderInfo: {
                isPrimary: true,
              },
              PersonInfo: {
                firstName: 'Luke',
                lastName: 'Skywalker',
              },
              LocationInfo: {
                phoneNumber: '555-123-1001',
                line1: '1001 Main St',
                city: 'Chippewa Falls',
                state: 'WI',
                zip: '54729',
                country: 'US',
              },
            },
            RecipientAddresses: [
              {
                HeaderInfo: {
                  isPrimary: false,
                },
                PersonInfo: {
                  firstName: 'Luke',
                  lastName: 'Skywalker',
                },
                LocationInfo: {
                  phoneNumber: '555-123-2001',
                  line1: '2001 Main St',
                  city: 'Chicago',
                  state: 'IL',
                  zip: '60007',
                  country: 'US',
                },
              },
              {
                HeaderInfo: {
                  isPrimary: false,
                },
                PersonInfo: {
                  firstName: 'Luke',
                  lastName: 'Skywalker',
                },
                LocationInfo: {
                  phoneNumber: '555-123-2002',
                  line1: '2002 Main St',
                  city: 'Minneapolis',
                  state: 'MN',
                  zip: '55111',
                  country: 'US',
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
        mappedBody = mapMasonToAccertify(inBody);
      });
      it('must have firstName of Luke', function () {
        expect(mappedBody.firstName).toBe('Luke');
      });
      it('must have lastName of Skywalker', function () {
        expect(mappedBody.lastName).toBe('Skywalker');
      });
      it('must have dateOfBirth of 1990-01-01', function () {
        expect(mappedBody.dateOfBirth).toBe('1990-01-01');
      });
      it('must have gender of M', function () {
        expect(mappedBody.gender).toBe('M');
      });
      it('must have 3 addresses', function () {
        expect(mappedBody.addresses!.length).toBe(3);
      });
    });
  });
  describe('Eventtype of accountUpdate', () => {
    it('should correctly map Mason CO Accertify object for request eventType of accountUpdate', () => {
      //input to be mapped
      inBody = {
        eventType: 'accountUpdate',
        eventSource: 'web',
        divisionCode: 'SM',
        BaseParameters: {
          returnScore: true,
          ipAddress: '10.11.12.13',
          userAgent:
            'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.61 Safari/537.36',
          deviceTransactionId: 'dti-123',
          ubaId: 'ubai-123',
          ubaEvents: 'ubae-123',
          ubaSessionId: 'wsi-123',
        },
        Customer: {
          CustomerInfo: {
            firstName: 'Luke',
            lastName: 'Skywalker',
            dob: '1990-01-01',
            gender: 'M',
            phone: '715-265-1234',
            zip: '54013-1234',
          },
          DivisionCustomers: [
            {
              DivisionCustomerInfo: {
                webAccountId: 'u123456789',
              },
            },
          ],
          BillingAddress: {
            HeaderInfo: {
              isPrimary: true,
            },
            PersonInfo: {
              firstName: 'Luke',
              lastName: 'Skywalker',
            },
            LocationInfo: {
              phoneNumber: '555-123-1001',
              line1: '1001 Main St',
              city: 'Chippewa Falls',
              state: 'WI',
              zip: '54729',
              country: 'US',
            },
          },
          RecipientAddresses: [
            {
              HeaderInfo: {
                isPrimary: false,
              },
              PersonInfo: {
                firstName: 'Luke',
                lastName: 'Skywalker',
              },
              LocationInfo: {
                phoneNumber: '555-123-2001',
                line1: '2001 Main St',
                city: 'Chicago',
                state: 'IL',
                zip: '60007',
                country: 'US',
              },
            },
            {
              HeaderInfo: {
                isPrimary: false,
              },
              PersonInfo: {
                firstName: 'Leia',
                lastName: 'Skywalker',
              },
              LocationInfo: {
                phoneNumber: '555-123-2002',
                line1: '2002 Main St',
                city: 'Minneapolis',
                state: 'MN',
                zip: '55111',
                country: 'US',
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
        PreviousCustomer: {
          CustomerInfo: {
            firstName: 'Han',
            lastName: 'Solo',
            dob: '1990-01-02',
            gender: 'F',
            phone: '715-265-4321',
            zip: '54013-4321',
          },
          BillingAddress: {
            HeaderInfo: {
              isPrimary: true,
            },
            PersonInfo: {
              firstName: 'Han',
              lastName: 'Solo',
            },
            LocationInfo: {
              phoneNumber: '555-123-5001',
              line1: '5001 Main St',
              city: 'Chippewa Falls',
              state: 'WI',
              zip: '54729',
              country: 'US',
            },
          },
          RecipientAddresses: [
            {
              HeaderInfo: {
                isPrimary: false,
              },
              PersonInfo: {
                firstName: 'Leia',
                lastName: 'Skywalker',
              },
              LocationInfo: {
                phoneNumber: '555-123-6001',
                line1: '6001 Main St',
                city: 'Chicago',
                state: 'IL',
                zip: '60007',
                country: 'US',
              },
            },
          ],
        },
        Payments: [
          {
            PaymentInfo: {
              paymentType: 'CreditCard',
            },
            PaymentDetail: {
              cardIssuerId: '100001',
              lastDigitsOfPan: 1111,
              SecureCreditCardInfo: {
                panTokenized: '1234123412341111',
                expirationDate: '0120',
                nameOnCard: 'Luke Skywalker',
              },
            },
            TransactionDetail: {
              CreditCardInfo: {
                avsResponseCode: 'M',
                cvvResponseCode: 'X',
              },
            },
          },
          {
            PaymentInfo: {
              paymentType: 'MasonCredit',
            },
          },
        ],
        PreviousPayments: [
          {
            PaymentInfo: {
              paymentType: 'CreditCard',
            },
            PaymentDetail: {
              cardIssuerId: '200001',
              lastDigitsOfPan: 2222,
              SecureCreditCardInfo: {
                panTokenized: '1234123412342222',
                expirationDate: '0220',
                nameOnCard: 'Han Solo',
              },
            },
            TransactionDetail: {
              CreditCardInfo: {
                avsResponseCode: 'N',
                cvvResponseCode: 'Y',
              },
            },
          },
          {
            PaymentInfo: {
              paymentType: 'Check',
            },
          },
          {
            PaymentInfo: {
              paymentType: 'Cash',
            },
          },
        ],
      };

      //ExpectedData
      expectedData = {
        eventSource: 'web',
        brand: 'SM',
        ipAddress: '10.11.12.13',
        userAgent:
          'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.61 Safari/537.36',
        deviceTransactionID: 'dti-123',
        ubaID: 'ubai-123',
        ubaEvents: 'ubae-123',
        ubaSessionId: 'wsi-123',
        returnScore: true,
        accountID: 'u123456789',
        emailAddress: 'lskywalker@rebelbase.net',
        username: 'lskywalker@rebelbase.net',
        updatedValues: {
          dateOfBirth: '1990-01-01',
          gender: 'M',
          firstName: 'Luke',
          lastName: 'Skywalker',
          phone: '17152651234',
          postCode: '54013-1234',
          addresses: [
            {
              addressType: 'billing',
              primaryFlag: 'true',
              firstName: 'Luke',
              lastName: 'Skywalker',
              address1: '1001 Main St',
              city: 'Chippewa Falls',
              region: 'WI',
              postCode: '54729',
              country: 'US',
              phone: '15551231001',
            },
            {
              primaryFlag: 'false',
              firstName: 'Luke',
              lastName: 'Skywalker',
              address1: '2001 Main St',
              city: 'Chicago',
              region: 'IL',
              postCode: '60007',
              country: 'US',
              phone: '15551232001',
            },
            {
              primaryFlag: 'false',
              firstName: 'Leia',
              lastName: 'Skywalker',
              address1: '2002 Main St',
              city: 'Minneapolis',
              region: 'MN',
              postCode: '55111',
              country: 'US',
              phone: '15551232002',
            },
          ],
        },
        previousValues: {
          dateOfBirth: '1990-01-02',
          gender: 'F',
          firstName: 'Han',
          lastName: 'Solo',
          phone: '17152654321',
          postCode: '54013-4321',
          addresses: [
            {
              addressType: 'billing',
              primaryFlag: 'true',
              firstName: 'Han',
              lastName: 'Solo',
              address1: '5001 Main St',
              city: 'Chippewa Falls',
              region: 'WI',
              postCode: '54729',
              country: 'US',
              phone: '15551235001',
            },
            {
              primaryFlag: 'false',
              firstName: 'Leia',
              lastName: 'Skywalker',
              address1: '6001 Main St',
              city: 'Chicago',
              region: 'IL',
              postCode: '60007',
              country: 'US',
              phone: '15551236001',
            },
          ],
          paymentMethods: [
            {
              paymentType: 'creditCard',
              cardBin: '200001',
              cardLastFour: 2222,
              expirationMonth: '02',
              expirationYear: '2020',
              nameOnCreditCard: 'Han Solo',
              avsResult: 'N',
              cvvResult: 'Y',
            },
            { paymentType: 'check' },
            { paymentType: 'cash' },
          ],
        },
        paymentMethods: [
          {
            paymentType: 'creditCard',
            cardBin: '100001',
            cardLastFour: 1111,
            expirationMonth: '01',
            expirationYear: '2020',
            nameOnCreditCard: 'Luke Skywalker',
            avsResult: 'M',
            cvvResult: 'X',
          },
          { paymentType: 'storeCredit' },
        ],
      };

      mappedBody = mapMasonToAccertify(inBody);

      // Jest Assertion
      expect(mappedBody).toEqual(expectedData);
    });
  });
});
