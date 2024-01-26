import { describe, expect, it } from '@jest/globals';
import { IMasonRequest } from '../../definitions/MasonEventRiskDef';
import { IOracleRequest } from '../../definitions/OracleEventRiskDef';
import { mapOracleToMason } from '../../operations/task/calculate-risk';

let inBody: IOracleRequest = {};
let mappedBody: IMasonRequest = {};
let expectedMasonData: IMasonRequest = {};

describe('CalculateRisk-Task Request Transformation Suite', () => {
  describe('Eventtype of login', () => {
    it('should correctly map Oracle request to Mason request for eventType of login', () => {
      //OracleData
      inBody = {
        eventType: 'login',
        eventSource: 'agentStore',
        divisionCode: 'SM',
        Parameters: {
          firstName: 'Luke',
          lastName: 'Skywalker',
          isSuccess: true,
          ipAddress: '10.11.12.13',
          userAgent:
            'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.61 Safari/537.36',
          deviceTransactionId: 'dti-123',
          ubaId: 'ubai-123',
          ubaEvents: 'ubae-123',
          accountStatus: 'good',
          password: 'pass123',
          hashedPassword: '9KQG4Gp4t7GhNV23',
          lastPasswordChangeDate: '2020-01-01',
          latitude: '58.99993333',
          longitude: '58.99993334',
          pageId: 'pag-123',
          ubaSessionId: 'ubas-123',
          failureCode: undefined,
          webAccountId: 'u123456789',
          emailAddress: 'lskywalker@rebelbase.net',
          returnScore: false,
        },
      };

      //ExpectedMasonData
      expectedMasonData = {
        eventType: 'login',
        eventSource: 'agentStore',
        divisionCode: 'SM',
        BaseParameters: {
          accountStatus: 'good',
          isSuccess: true,
          ipAddress: '10.11.12.13',
          userAgent:
            'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.61 Safari/537.36',
          deviceTransactionId: 'dti-123',
          ubaId: 'ubai-123',
          ubaEvents: 'ubae-123',
          hashedPassword: '9KQG4Gp4t7GhNV23',
          ubaSessionId: 'ubas-123',
          pageId: 'pag-123',
          returnScore: false,
          lastPasswordChangeDate: '2020-01-01',
          latitude: '58.99993333',
          longitude: '58.99993334',
          password: 'pass123',
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

      mappedBody = mapOracleToMason(inBody);

      // Jest Assertion
      expect(mappedBody).toEqual(expectedMasonData);
    });
  });

  describe('Eventtype of accountCreate', () => {
    it('should correctly map Oracle request to Mason request for eventType of accountCreate', () => {
      //OracleData
      inBody = {
        eventType: 'accountCreate',
        eventSource: 'web',
        divisionCode: 'SM',
        Parameters: {
          isSuccess: true,
          returnScore: true,
          failureCode: undefined,
          ipAddress: '10.11.12.13',
          userAgent:
            'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.61 Safari/537.36',
          deviceTransactionId: 'dti-123',
          ubaId: 'ubai-123',
          ubaEvents: 'ubae-123',
          ubaSessionId: 'ubas-123',
          webAccountId: 'u123456789',
          emailAddress: 'lskywalker@rebelbase.net',
          password: 'pass-123',
          hashedPassword: 'jkth87',
          latitude: '58.99993333',
          longitude: '58.99993333',
          firstName: 'Luke',
          lastName: 'Skywalker',
        },
      };

      //ExpectedMasonData
      expectedMasonData = {
        eventType: 'accountCreate',
        eventSource: 'web',
        divisionCode: 'SM',
        BaseParameters: {
          isSuccess: true,
          returnScore: true,
          ipAddress: '10.11.12.13',
          deviceTransactionId: 'dti-123',
          hashedPassword: 'jkth87',
          latitude: '58.99993333',
          longitude: '58.99993333',
          password: 'pass-123',
          ubaId: 'ubai-123',
          ubaEvents: 'ubae-123',
          ubaSessionId: 'ubas-123',
          userAgent:
            'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.61 Safari/537.36',
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

      mappedBody = mapOracleToMason(inBody);

      // Jest Assertion
      expect(mappedBody).toEqual(expectedMasonData);
    });
  });

  describe('Eventtype of accountUpdate', () => {
    it('should correctly map Oracle request to Mason request for eventType of accountUpdate', () => {
      //OracleData
      inBody = {
        eventType: 'accountUpdate',
        eventSource: 'web',
        divisionCode: 'SM',
        Parameters: {
          isSuccess: true,
          ipAddress: '10.11.12.13',
          userAgent:
            'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.61 Safari/537.36',
          deviceTransactionId: 'dti-123',
          ubaId: 'ubai-123',
          ubaEvents: 'ubae-123',
          ubaSessionId: 'ubas-123',
          password: 'pass123',
          hashedPassword: '9KQG4Gp4t7GhNV23',
          updatedHashedPassword: 'pass-1001',
          previousHashedPassword: 'pass-2001',
          webAccountId: 'u123456789',
          emailAddress: 'lskywalker@rebelbase.net',
          firstName: 'Luke',
          previousFirstName: 'Han',
          lastName: 'Skywalker',
          previousLastName: 'Solo',
          dob: '12-30-1990',
          previousDob: '12-31-1990',
          gender: 'M',
          previousGender: 'F',
          zip: '54729',
          previousZip: '54730',
          phone: '555-123-1001',
          previousPhone: '555-123-9009',
          returnScore: true,
          Addresses: [
            {
              addrType: 'billing',
              isPrimary: true,
              firstName: 'Luke',
              lastName: 'Skywalker',
              addr1: '1001 Main St',
              addr2: 'apt 1',
              city: 'Chippewa Falls',
              state: 'WI',
              zip: '54729',
              country: 'US',
              email: '1001@rebelbase.net',
              phone: '555-123-1001',
            },
            {
              addrType: 'shipping',
              isPrimary: false,
              firstName: 'Luke',
              lastName: 'Skywalker',
              addr1: '2001 Main St',
              city: 'Chicago',
              state: 'IL',
              zip: '60007',
              country: 'US',
              email: '2001@rebelbase.net',
              phone: '555-123-2001',
            },
            {
              isPrimary: false,
              firstName: 'Leia',
              lastName: 'Skywalker',
              addr1: '2002 Main St',
              city: 'Minneapolis',
              state: 'MN',
              zip: '55111',
              country: 'US',
              email: '2002@rebelbase.net',
              phone: '555-123-2002',
            },
          ],
          PreviousAddresses: [
            {
              addrType: 'billing',
              isPrimary: true,
              firstName: 'Han',
              lastName: 'Solo',
              addr1: '5001 Main St',
              city: 'Chippewa Falls',
              state: 'WI',
              zip: '54729',
              country: 'US',
              email: '5001@rebelbase.net',
              phone: '555-123-5001',
            },
            {
              isPrimary: false,
              firstName: 'Leia',
              lastName: 'Solo',
              addr1: '6001 Main St',
              city: 'Chicago',
              state: 'IL',
              zip: '60007',
              country: 'US',
              email: '6001@rebelbase.net',
              phone: '555-123-6001',
            },
          ],
          PaymentMethods: [
            {
              paymentType: 'CC',
              panTokenized: '1234123412341111',
              expirationDate: '0120',
              nameOnCard: 'Luke Skywalker',
              cardIssuerId: '100001',
              lastDigitsOfPan: 1111,
              avsResponseCode: 'M',
              cvvResponseCode: 'X',
            },
            {
              paymentType: 'MC',
            },
          ],
          PreviousPaymentMethods: [
            {
              paymentType: 'CC',
              panTokenized: '1234123412342222',
              expirationDate: '0220',
              nameOnCard: 'Han Solo',
              cardIssuerId: '200001',
              lastDigitsOfPan: 2222,
              avsResponseCode: 'N',
              cvvResponseCode: 'Y',
            },
            {
              paymentType: 'CK',
            },
            {
              paymentType: 'CA',
            },
          ],
        },
      };

      //ExpectedMasonData
      expectedMasonData = {
        Customer: {
          CustomerInfo: {
            dob: '1990-12-30',
            gender: 'M',
            firstName: 'Luke',
            lastName: 'Skywalker',
            phone: '555-123-1001',
            zip: '54729',
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
          RecipientAddresses: [
            {
              HeaderInfo: {
                addressType: 'shipping',
                isPrimary: false,
              },
              PersonInfo: {
                firstName: 'Luke',
                lastName: 'Skywalker',
              },
              LocationInfo: {
                line1: '2001 Main St',
                city: 'Chicago',
                state: 'IL',
                zip: '60007',
                country: 'US',
                emailAddress: '2001@rebelbase.net',
                phoneNumber: '555-123-2001',
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
                line1: '2002 Main St',
                city: 'Minneapolis',
                state: 'MN',
                zip: '55111',
                country: 'US',
                emailAddress: '2002@rebelbase.net',
                phoneNumber: '555-123-2002',
              },
            },
          ],
          BillingAddress: {
            HeaderInfo: {
              addressType: 'billing',
              isPrimary: true,
            },
            PersonInfo: {
              firstName: 'Luke',
              lastName: 'Skywalker',
            },
            LocationInfo: {
              line1: '1001 Main St',
              line2: 'apt 1',
              city: 'Chippewa Falls',
              state: 'WI',
              zip: '54729',
              country: 'US',
              emailAddress: '1001@rebelbase.net',
              phoneNumber: '555-123-1001',
            },
          },
        },
        eventType: 'accountUpdate',
        eventSource: 'web',
        divisionCode: 'SM',
        BaseParameters: {
          isSuccess: true,
          ipAddress: '10.11.12.13',
          userAgent:
            'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.61 Safari/537.36',
          deviceTransactionId: 'dti-123',
          ubaId: 'ubai-123',
          ubaEvents: 'ubae-123',
          ubaSessionId: 'ubas-123',
          password: 'pass123',
          hashedPassword: 'pass-1001',
          returnScore: true,
        },
        PreviousCustomer: {
          CustomerInfo: {
            hashedPassword: 'pass-2001',
            dob: '1990-12-31',
            gender: 'F',
            firstName: 'Han',
            lastName: 'Solo',
            phone: '555-123-9009',
            zip: '54730',
          },
          RecipientAddresses: [
            {
              HeaderInfo: {
                isPrimary: false,
              },
              PersonInfo: {
                firstName: 'Leia',
                lastName: 'Solo',
              },
              LocationInfo: {
                line1: '6001 Main St',
                city: 'Chicago',
                state: 'IL',
                zip: '60007',
                country: 'US',
                emailAddress: '6001@rebelbase.net',
                phoneNumber: '555-123-6001',
              },
            },
          ],
          BillingAddress: {
            HeaderInfo: {
              addressType: 'billing',
              isPrimary: true,
            },
            PersonInfo: {
              firstName: 'Han',
              lastName: 'Solo',
            },
            LocationInfo: {
              line1: '5001 Main St',
              city: 'Chippewa Falls',
              state: 'WI',
              zip: '54729',
              country: 'US',
              emailAddress: '5001@rebelbase.net',
              phoneNumber: '555-123-5001',
            },
          },
        },
        Payments: [
          {
            PaymentInfo: {
              paymentType: 'CreditCard',
            },
            PaymentDetail: {
              SecureCreditCardInfo: {
                panTokenized: '1234123412341111',
                expirationDate: '0120',
                nameOnCard: 'Luke Skywalker',
              },
              cardIssuerId: '100001',
              lastDigitsOfPan: 1111,
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
              SecureCreditCardInfo: {
                panTokenized: '1234123412342222',
                expirationDate: '0220',
                nameOnCard: 'Han Solo',
              },
              cardIssuerId: '200001',
              lastDigitsOfPan: 2222,
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

      mappedBody = mapOracleToMason(inBody);

      // Jest Assertion
      expect(mappedBody).toEqual(expectedMasonData);
    });
  });

  describe('Eventtype of passwordForgot', () => {
    describe('a complete passwordForgot request', () => {
      beforeAll(() => {
        inBody = {
          eventType: 'passwordForgot',
          eventSource: 'web',
          divisionCode: 'SM',
          Parameters: {
            isSuccess: true,
            ipAddress: '10.11.12.13',
            userAgent:
              'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.61 Safari/537.36',
            deviceTransactionId: 'dti-123',
            ubaId: 'ubai-123',
            ubaEvents: 'ubae-123',
            ubaSessionId: 'ubas-123',
            webAccountId: 'u123456789',
            emailAddress: 'lskywalker@rebelbase.net',
          },
        };
        mappedBody = mapOracleToMason(inBody);
      });
      it('must have event type of passwordForgot', () => {
        expect(mappedBody.eventType).toBe('passwordForgot');
      });
      it('must have webAccountId of u123456789', () => {
        expect(
          mappedBody.Customer!.DivisionCustomers![0].DivisionCustomerInfo!
            .webAccountId,
        ).toBe('u123456789');
      });
      it('must have emailAddress of lskywalker@rebelbase.net', () => {
        expect(
          mappedBody.Customer!.EmailRecords![0].EmailInfo!.emailAddress,
        ).toBe('lskywalker@rebelbase.net');
      });
    });
  });

  describe('Eventtype of passwordUpdate', () => {
    describe('a complete passwordUpdate request', () => {
      beforeAll(() => {
        inBody = {
          eventType: 'passwordUpdate',
          eventSource: 'web',
          divisionCode: 'SM',
          Parameters: {
            isSuccess: true,
            ipAddress: '10.11.12.13',
            userAgent:
              'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.61 Safari/537.36',
            deviceTransactionId: 'dti-123',
            ubaId: 'ubai-123',
            ubaEvents: 'ubae-123',
            ubaSessionId: 'ubas-123',
            webAccountId: 'u123456789',
            emailAddress: 'lskywalker@rebelbase.net',
            updateTrigger: 'customerInitiated',
            previousHashedPassword: 'jkth87',
            updatedHashedPassword: 'ld4ui3',
          },
        };
        mappedBody = mapOracleToMason(inBody);
      });
      it('must have event type of passwordUpdate', () => {
        expect(mappedBody.eventType).toBe('passwordUpdate');
      });
      it('must have event type of customerInitiated', () => {
        expect(mappedBody.BaseParameters!.updateTrigger).toBe(
          'customerInitiated',
        );
      });
      it('must have previousHashedPassword of jkth87', () => {
        expect(mappedBody.BaseParameters!.previousHashedPassword).toBe(
          'jkth87',
        );
      });
      it('must have updatedHashedPassword of ld4ui3', () => {
        expect(mappedBody.BaseParameters!.updatedHashedPassword).toBe('ld4ui3');
      });
    });
  });

  describe('Eventtype of payment', () => {
    describe('a complete payment request', () => {
      beforeAll(() => {
        inBody = {
          eventType: 'payment',
          eventSource: 'web',
          divisionCode: 'SM',
          Parameters: {
            isSuccess: true,
            ipAddress: '10.11.12.13',
            userAgent:
              'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.61 Safari/537.36',
            deviceTransactionId: 'dti-123',
            ubaId: 'ubai-123',
            ubaEvents: 'ubae-123',
            ubaSessionId: 'ubas-123',
            webAccountId: 'u123456789',
            emailAddress: 'lskywalker@rebelbase.net',
            transactionId: 'paytrans-123',
            paymentAmount: 123.45,
            currencyCode: 'USD',
            PaymentMethods: [
              {
                paymentType: 'CC',
                panTokenized: '1234123412341111',
                expirationDate: '0120',
                nameOnCard: 'Luke Skywalker',
                cardIssuerId: '100001',
                lastDigitsOfPan: 1111,
                avsResponseCode: 'M',
                cvvResponseCode: 'X',
              },
              {
                paymentType: 'MC',
              },
            ],
          },
        };
        mappedBody = mapOracleToMason(inBody);
      });
      it('must have event type of payment', () => {
        expect(mappedBody.eventType).toBe('payment');
      });
      it('must have transactionId of paytrans-123', () => {
        expect(mappedBody.BaseParameters!.transactionId).toBe('paytrans-123');
      });
      it('must have paymentAmount of 123.45', () => {
        expect(mappedBody.BaseParameters!.paymentAmount).toBe(123.45);
      });
      it('must have currencyCode of USD', () => {
        expect(mappedBody.BaseParameters!.currencyCode).toBe('USD');
      });
      it('must have Payments.length of 2', () => {
        expect(mappedBody.Payments!.length).toBe(2);
      });
      it('must have Payments[0].PaymentInfo.paymentType of CreditCard', () => {
        expect(mappedBody.Payments![0].PaymentInfo!.paymentType).toBe(
          'CreditCard',
        );
      });
      it('must have Payments[0].PaymentDetail.SecureCreditCardInfo.panTokenized of 1234123412341111', () => {
        expect(
          mappedBody.Payments![0].PaymentDetail!.SecureCreditCardInfo!
            .panTokenized,
        ).toBe('1234123412341111');
      });
      it('must have Payments[0].PaymentDetail.SecureCreditCardInfo.expirationDate of 0120', () => {
        expect(
          mappedBody.Payments![0].PaymentDetail!.SecureCreditCardInfo!
            .expirationDate,
        ).toBe('0120');
      });
      it("must have Payments[0].PaymentDetail.SecureCreditCardInfo.nameOnCard of 'Luke Skywalker'", () => {
        expect(
          mappedBody.Payments![0].PaymentDetail!.SecureCreditCardInfo!
            .nameOnCard,
        ).toBe('Luke Skywalker');
      });
      it('must have Payments[0].PaymentDetail.cardIssuerId of 100001', () => {
        expect(mappedBody.Payments![0].PaymentDetail!.cardIssuerId).toBe(
          '100001',
        );
      });
      it('must have Payments[0].PaymentDetail.lastDigitsOfPan of 1111', () => {
        expect(mappedBody.Payments![0].PaymentDetail!.lastDigitsOfPan).toBe(
          1111,
        );
      });
      it('must have Payments[0].TransactionDetail.CreditCardInfo.avsResponseCode of M', () => {
        expect(
          mappedBody.Payments![0].TransactionDetail!.CreditCardInfo!
            .avsResponseCode,
        ).toBe('M');
      });
      it('must have Payments[0].TransactionDetail.CreditCardInfo.cvvResponseCode of X', () => {
        expect(
          mappedBody.Payments![0].TransactionDetail!.CreditCardInfo!
            .cvvResponseCode,
        ).toBe('X');
      });
      it('must have Payments[1].PaymentInfo.paymentType of MasonCredit', () => {
        expect(mappedBody.Payments![1].PaymentInfo!.paymentType).toBe(
          'MasonCredit',
        );
      });
    });
  });

  describe('Eventtype of verification', () => {
    describe('a complete verification request', () => {
      beforeAll(() => {
        inBody = {
          eventType: 'verification',
          eventSource: 'web',
          divisionCode: 'SM',
          Parameters: {
            isSuccess: true,
            ipAddress: '10.11.12.13',
            userAgent:
              'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.61 Safari/537.36',
            deviceTransactionId: 'dti-123',
            ubaId: 'ubai-123',
            ubaEvents: 'ubae-123',
            ubaSessionId: 'ubas-123',
            webAccountId: 'u123456789',
            emailAddress: 'lskywalker@rebelbase.net',
            returnScore: true,
          },
        };
        mappedBody = mapOracleToMason(inBody);
      });
      it('must have event type of verification', () => {
        expect(mappedBody.eventType).toBe('verification');
      });
      it('must have returnScore of true', () => {
        expect(mappedBody.BaseParameters!.returnScore).toBe(true);
      });
    });
  });
});
