import { SecretsManager } from 'aws-sdk';
import pino from 'pino';

const logger = pino({
  level: 'info',
});

export const fetchSecret = async <T>(secretName: string): Promise<T> => {
  const region = process.env.AWS_REGION || 'us-east-2';
  const secretsManager = new SecretsManager({ region });

  return new Promise((resolve, reject) => {
    secretsManager.getSecretValue({ SecretId: secretName }, (err, data) => {
      if (err) {
        logger.error(
          { err, secretName },
          'An error occurred while retrieving the secret',
        );
        reject(err);
      } else if (!data.SecretString) {
        const errorMessage = 'Secret string is undefined';
        logger.error({ errorMessage, secretName }, 'Failed to retrieve secret');
        reject(new Error(errorMessage));
      } else {
        const secret: T = JSON.parse(data.SecretString as string);
        logger.info({ secretName }, 'Successfully retrieved secret');
        resolve(secret);
      }
    });
  });
};
