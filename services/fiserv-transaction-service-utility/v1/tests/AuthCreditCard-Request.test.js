import { describe, expect, it } from '@jest/globals';
import { authCreditCard_Request } from '../operations/AuthCreditCard';

let encryptedCCData, inBody, expectedPayload, mappedBody;

describe('AuthCreditCard request transformation suite.', () => {

  describe('A complete request transformed from Mason CO to Fiserv Object.', () => {
    it('Should correctly transform existing OMS Customer information.', () => {
      //Mason Payload
      encryptedCCData = {
        keyId: '64ef70e2a3d69861a65d4c7e6a75db0a',
        encryptionType: 'RSA',
        encryptionBlock: '=s3ZmiL1SSZC8QyBpj/Wn+VwpLDgp41IwstEHQS8u4EQJ....',
        encryptionBlockFields:
          'card.cardData:16,card.nameOnCard:10,card.expirationMonth:2,card.expirationYear:4,card.securityCode:3',
        encryptionTarget: 'MANUAL',
      };
      inBody = {
        "Payment": {
          "PaymentInfo": {
            "amount": 153.25
          },
          "PaymentDetail": {
            "CreditCardDetail": {
              "nameOnCard": "Jessie James",
              "expirationDate": 1225,
              "securityCode": "123",
              "cardIssuerName": "mastercard",
              "pan": "5424180279791732"
            }
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
              "country": "US",
              "emailAddress": "jessie_james@test.mason.com"
            }
          }
        },
        "Customer": {
          "CustomerInfo": {
            "omsCustomerId": 45678915
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
              ]
            }
          ]
        }
      }
      //Expected Fiserv Payload
      expectedPayload = {
        "source": {
          "sourceType": "PaymentCard",
          "tokenSource": "TRANSARMOR",
          "encryptionData": {
            "keyId": "64ef70e2a3d69861a65d4c7e6a75db0a",
            "encryptionType": "RSA",
            "encryptionBlock": "=s3ZmiL1SSZC8QyBpj/Wn+VwpLDgp41IwstEHQS8u4EQJ....",
            "encryptionBlockFields": "card.cardData:16,card.nameOnCard:10,card.expirationMonth:2,card.expirationYear:4,card.securityCode:3",
            "encryptionTarget": "MANUAL"
          }
        },
        "transactionDetails": { 
          "captureFlag": false, 
          "primaryTransactionType": "AUTH_ONLY", 
          "merchantOrderId": 45678915, 
          "merchantInvoiceNumber": 45678915 
        },
        "billingAddress": {
          "address": {
            "country": "US",
            "street": "1251 1st Ave",
            "houseNumberOrName": "Suit 1",
            "city": "Chippewa Falls",
            "stateOrProvince": "WI",
            "postalCode": "54729"
          },
          "firstName": "Jessie",
          "lastName": "James",
          "phone": { 
            "phoneNumber": "715-555-5555"
          }
        },
        "merchantDetails": { 
          "tokenType": "LHC0", 
          "merchantId": "100173000000053", 
          "terminalId": "10000001" 
        },
        "customer": {
          "email": "jessie_james@test.mason.com"
        }
      };

      //make call to transformation function
      mappedBody = authCreditCard_Request(inBody, encryptedCCData);

      //Jest Assertion
      expect(mappedBody).toEqual(expectedPayload);
    });
  });

  describe('A complete request transformed from Mason CO to Fiserv Object.', () => {
    it('Should correctly transform a new Web customer.', () => {
      //Mason Payload
      encryptedCCData = {
        "keyId": "76a79bc1ca9c8873024b0b47f483fad0",
        "encryptionType": "RSA",
        "encryptionBlock": "oNAalcphHT1RLx4fehhem3P40wpTlaKe336FKfPC/dL49677iTRLPdlx8iwdSmPYW0Tj8KETLUbMrKv33sO2EYE2LWGDKcSGYzFVg/10ACfo8uXSXrav5BuGzUjyEgxl05PVB+wFYNa0vTXrC8/CzI/Xy0I6EFBBPxNWxeRq+sghY3N4w0sNu6tdEuB/lYvjhi0FRjvKeVDIjZasGRDUMQepZQCwGyJOqgnLVBNBh0t7l/p4o3QvgLMd64EGkbN5gjnOIRdNBmfZ71p6FEIxqJADNtMHgnOKm1ZWOp37ZsbQxmu5dTTvoBgNBVJ6HyZ/HictAiRRoFbb5ohkZddCSg==",
        "encryptionBlockFields": "card.cardData:16,card.nameOnCard:12,card.expirationMonth:2,card.expirationYear:4,card.securityCode:3",
        "encryptionTarget": "MANUAL"
      }
      inBody = {
        "Payment": {
          "PaymentInfo": {
            "amount": 10.25
          },
          "PaymentDetail": {
            "CreditCardDetail": {
              "nameOnCard": "Jessie James",
              "expirationDate": 1223,
              "securityCode": "123",
              "cardIssuerName": "Visa",
              "pan": "4111111111111111"
            }
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
              "country": "US",
              "emailAddress": "jessie_james@test.mason.com"
            }
          }
        },
        "Customer": {
          "DivisionCustomers": [
            {
              "divisionCode": "ZB",
              "WebAccounts": [
                {
                  "webAccountId": "uZB24253534"
                }
              ],
              "PhoneRecords": [
                {
                  "HeaderInfo": {
                    "phoneType": "P"
                  },
                  "PhoneInfo": {
                    "phoneNumber": "715-555-5555"
                  }
                }
              ]
            }
          ]
        }
      }
      //Expected Advantage Payload
      let expectedPayload = {
        "source": {
          "sourceType": "PaymentCard",
          "tokenSource": "TRANSARMOR",
          "encryptionData": {
            "keyId": "76a79bc1ca9c8873024b0b47f483fad0",
            "encryptionType": "RSA",
            "encryptionBlock": "oNAalcphHT1RLx4fehhem3P40wpTlaKe336FKfPC/dL49677iTRLPdlx8iwdSmPYW0Tj8KETLUbMrKv33sO2EYE2LWGDKcSGYzFVg/10ACfo8uXSXrav5BuGzUjyEgxl05PVB+wFYNa0vTXrC8/CzI/Xy0I6EFBBPxNWxeRq+sghY3N4w0sNu6tdEuB/lYvjhi0FRjvKeVDIjZasGRDUMQepZQCwGyJOqgnLVBNBh0t7l/p4o3QvgLMd64EGkbN5gjnOIRdNBmfZ71p6FEIxqJADNtMHgnOKm1ZWOp37ZsbQxmu5dTTvoBgNBVJ6HyZ/HictAiRRoFbb5ohkZddCSg==",
            "encryptionBlockFields": "card.cardData:16,card.nameOnCard:12,card.expirationMonth:2,card.expirationYear:4,card.securityCode:3",
            "encryptionTarget": "MANUAL"
          }
        },
        "transactionDetails": {
          "captureFlag": false,
          "primaryTransactionType": "AUTH_ONLY",
          "merchantOrderId": "uZB24253534",
          "merchantInvoiceNumber": "uZB24253534"
        },
        "billingAddress": {
          "address": {
            "country": "US",
            "street": "1251 1st Ave",
            "houseNumberOrName": "Suit 1",
            "city": "Chippewa Falls",
            "stateOrProvince": "WI",
            "postalCode": "54729"
          },
          "firstName": "Jessie",
          "lastName": "James",
          "phone": { 
            "phoneNumber": "715-555-5555" 
          }
        },
        "merchantDetails": { 
          "tokenType": "LHC0", 
          "merchantId": "100173000000053", 
          "terminalId": "10000001" 
        },
        "customer": { 
          "email": "jessie_james@test.mason.com" 
        }
      };

      //make call to transformation function
      let mappedBody = authCreditCard_Request(inBody, encryptedCCData);

      //Jest Assertion
      expect(mappedBody).toEqual(expectedPayload);
    });
  });
});
