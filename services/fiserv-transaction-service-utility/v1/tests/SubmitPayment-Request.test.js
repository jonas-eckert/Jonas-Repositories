import { describe, expect, it } from '@jest/globals';
import { submitPayment_Request } from '../operations/SubmitPayment';

let inBody, mappedBody, expectedPayload, encryptedCCData;

describe('SubmitPayment Request transformation suite.', () => {
  describe('A complete response transformed from Mason CO to Fiserv Object', () => {
    it('Should correctly transform an Payment On Account request using panTokenized.', () => {
      //Mason Payload
      inBody = {
        "Payment": {
          "PaymentInfo": {
            "amount": 153.25,
          },
          "PaymentDetail": {
            "CreditCardDetail": {
              "panTokenized": '12465478945984988',
              "nameOnCard": 'Jessie James',
              "expirationDate": 1223,
              "cardIssuerName": 'Visa',
            },
          },
        },
        "Customer": {
          "CustomerInfo": {
            "omsCustomerId": '45678915',
          },
          "BillingAddress": {
            "PersonInfo": {
              "firstName": 'Jessie',
              "lastName": 'James',
            },
            "LocationInfo": {
              "line1": '1251 1st Ave',
              "line2": 'Suit 1',
              "city": 'Chippewa Falls',
              "state": 'WI',
              "zip": '54729',
              "country": 'US',
            },
          },
          "DivisionCustomers": [
            {
              "divisionCode": 'ZB',
              "PhoneRecords": [
                {
                  "HeaderInfo": {
                    "phoneType": 'P',
                  },
                  "PhoneInfo": {
                    "phoneNumber": '715-555-5555',
                  },
                },
              ],
              "EmailRecords": [
                {
                  "EmailInfo": {
                    "emailAddress": 'jessie_james@test.mason.com',
                  },
                },
              ],
            },
          ],
        },
      };

      //Make call to transformation function
      mappedBody = submitPayment_Request(inBody);

      //Expected Fiserv Payload
      expectedPayload = {
        "amount": {
          "total": 15325,
          "currency": 'USD',
        },
        "source": {
          "sourceType": 'PaymentToken',
          "tokenData": "12465478945984988",
          "tokenSource": 'TRANSARMOR',
          "card": {
            "nameOnCard": 'Jessie James',
            "expirationMonth": '12',
            "expirationYear": '2023',
            "scheme": 'VISA',
          },
        },
        "transactionDetails": {
          "captureFlag": true,
          "primaryTransactionType": 'CHARGE_SALE',
          "merchantOrderId": '45678915',
          "merchantInvoiceNumber": '45678915',
        },
        "billingAddress": {
          "address": {
            "street": '1251 1st Ave',
            "houseNumberOrName": 'Suit 1',
            "city": 'Chippewa Falls',
            "stateOrProvince": 'WI',
            "postalCode": '54729',
            "country": 'US',
          },
          "phone": {
            "phoneNumber": '715-555-5555',
          },
        },
        "merchantDetails": {
          "terminalId": '10000001',
          "merchantId": '100173000000053',
        },
      };

      //Jest Assertion
      expect(mappedBody).toEqual(expectedPayload);
    });
  });


  describe('A complete response transformed from Fiserv Object to Mason CO', () => {
    it('Should correctly transform an Payment On Account request using encrypted CC data.', () => {
      //Mason Payload
      encryptedCCData = {
        "keyId": "083db278727037f86f7feb1aae5ed9a3",
        "encryptionType": "RSA",
        "encryptionBlock": "QR+a9b+FHD0Llobc5rd5WrYa8XuHzybsXw2SKQ74K4RgQ+HnPsYUVp39+0QHdPyMNGHBDxoZTELhhLclw8Sg2mwiBQCkgPQjrfyNY8kjWGyaqvSBSM8qpv2RVi1/nqg3OFQ/g26w9Z60c8W+3smZCXdIYFbIRoKybvpFtd8Wu9fCP+6M6zmUt4AlyNJdGafov87i6F3V2YaKM8RrLJu7qms/u5GeyOl4rfodGc9HXhh595Pg4+gdjXo4fzFAV04nazyj0KLyUGq1sRrNvz0SwSZ1Z2vLZq3KvRheXN1cxp8wT4LPEwSX0bPhAefoCSKn63iiO2AsE0xUZiNsXBX2dg==",
        "encryptionBlockFields": "card.cardData:16,card.nameOnCard:12,card.expirationMonth:2,card.expirationYear:4,card.securityCode:3",
        "encryptionTarget": "MANUAL"
      };
      inBody = {
        "Payment": {
          "PaymentInfo": {
            "amount": 13.25
          },
          "PaymentDetail": {
            "CreditCardDetail": {
              "nameOnCard": "Jessie James",
              "expirationDate": 1225,
              "securityCode": "123",
              "cardIssuerName": "mastercard",
              "pan": "5424180279791732"
            }
          }
        },
        "Customer": {
          "CustomerInfo": {
            "omsCustomerId": "45678915"
          },
          "BillingAddress": {
            "PersonInfo": {
              "firstName": "Jessie",
              "lastName": "James"
            },
            "LocationInfo": {
              "line1": "1251 1st Ave",
              "line2": "Suit 1",
              "city": "Chippewa Falls",
              "state": "WI",
              "zip": "54729",
              "country": "US"
            }
          },
          "DivisionCustomers": [
            {
              "PhoneRecords": [
                {
                  "HeaderInfo": {
                    "phoneType": "P"
                  },
                  "PhoneInfo": {
                    "phoneNumber": "715-555-5555"
                  }
                }
              ],
              "EmailRecords": {
                "EmailInfo": {
                  "emailAddress": "jessie_james@test.mason.com"
                }
              }
            }
          ]
        }
      }

      //Expected Fiserv Payload
      expectedPayload = {
        "amount": {
          "currency": "USD",
          "total": 1325
        },
        "source": {
          "sourceType": "PaymentCard",
          "encryptionData": {
            "keyId": "083db278727037f86f7feb1aae5ed9a3",
            "encryptionType": "RSA",
            "encryptionBlock": "QR+a9b+FHD0Llobc5rd5WrYa8XuHzybsXw2SKQ74K4RgQ+HnPsYUVp39+0QHdPyMNGHBDxoZTELhhLclw8Sg2mwiBQCkgPQjrfyNY8kjWGyaqvSBSM8qpv2RVi1/nqg3OFQ/g26w9Z60c8W+3smZCXdIYFbIRoKybvpFtd8Wu9fCP+6M6zmUt4AlyNJdGafov87i6F3V2YaKM8RrLJu7qms/u5GeyOl4rfodGc9HXhh595Pg4+gdjXo4fzFAV04nazyj0KLyUGq1sRrNvz0SwSZ1Z2vLZq3KvRheXN1cxp8wT4LPEwSX0bPhAefoCSKn63iiO2AsE0xUZiNsXBX2dg==",
            "encryptionBlockFields": "card.cardData:16,card.nameOnCard:12,card.expirationMonth:2,card.expirationYear:4,card.securityCode:3",
            "encryptionTarget": "MANUAL"
          }
        },
        "transactionDetails": {
          "captureFlag": true,
          "merchantInvoiceNumber": "45678915",
          "merchantOrderId": "45678915",
          "primaryTransactionType": "CHARGE_SALE",
        },
        "billingAddress": {
          "address": {
            "city": "Chippewa Falls",
            "country": "US",
            "houseNumberOrName": "Suit 1",
            "postalCode": "54729",
            "stateOrProvince": "WI",
            "street": "1251 1st Ave",
          },
          "phone": {
            "phoneNumber": "715-555-5555"
          }
        },
        "merchantDetails": {
          "merchantId": "100173000000053",
          "terminalId": "10000001"
        }
      };

      //Make call to transformation function
      mappedBody = submitPayment_Request(inBody, encryptedCCData);

      //Jest Assertion
      expect(mappedBody).toEqual(expectedPayload);
    });
  });
});
