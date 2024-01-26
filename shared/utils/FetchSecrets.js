import { SecretsManager } from '@aws-sdk/client-secrets-manager';
import pino from 'pino';

const logger = pino({
  level: 'info',
});

export const fetchSecret = async (secretName) => {
  const region = process.env.AWS_REGION || 'us-east-2';
  const secretsManager = new SecretsManager({ region });

  return new Promise((resolve, reject) => {
    secretsManager.getSecretValue({ SecretId: secretName }, (err, data) => {
      if (err) {
        logger.error(
          { err, secretName },
          'An error occurred while retrieving the secret'
        );
        reject(err);
      } else if (!data.SecretString) {
        const errorMessage = 'Secret string is undefined';
        logger.error(
          { errorMessage, secretName },
          'Failed to retrieve secret'
        );
        reject(new Error(errorMessage));
      } else {
        const secret = JSON.parse(data.SecretString);
        logger.info({ secretName }, 'Successfully retrieved secret');
        resolve(secret);
      }
    });
  });
};

