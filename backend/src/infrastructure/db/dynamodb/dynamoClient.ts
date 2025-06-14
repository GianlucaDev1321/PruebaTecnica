import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import { config } from '../../../config/config';

export const client = DynamoDBDocumentClient.from(
  new DynamoDBClient({ region: config.awsRegion })
);
