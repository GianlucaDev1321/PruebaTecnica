import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand, QueryCommand } from '@aws-sdk/lib-dynamodb';
import { config } from '../../../config/config';

const client = DynamoDBDocumentClient.from(new DynamoDBClient({ region: config.awsRegion }));


interface OTPRecord {
  aprobadorId: string;
  token: string;
  expiresAt: number;
}

export const guardarOTP = async (otp: OTPRecord): Promise<void> => {
  await client.send(
    new PutCommand({
      TableName: config.otpTable,
      Item: otp,
    })
  );
};

export const obtenerAprobadorIdPorToken = async (token: string): Promise<string | null> => {
  // const command = new QueryCommand({
  //   TableName: config.otpTable,
  //   IndexName: 'TokenIndex',
  //   KeyConditionExpression: '#token = :t',
  //   ExpressionAttributeNames: {
  //     '#token': 'token',
  //   },
  //   ExpressionAttributeValues: {
  //     ':t': token,
  //   },
  // });

  // const result = await client.send(command);
  // const item = result.Items?.[0];

  // if (!item) return null;

  // const now = Math.floor(Date.now() / 1000);
  // if (item.expiraEn < now) return null;

  // return item.aprobadorId;
  try {
    const command = new QueryCommand({
      TableName: config.otpTable,
      IndexName: 'TokenIndex',
      KeyConditionExpression: '#token = :t',
      ExpressionAttributeNames: {
        '#token': 'token',
      },
      ExpressionAttributeValues: {
        ':t': token,
      },
    });

    const result = await client.send(command);
    const item = result.Items?.[0];

    if (!item) return null;

    const now = Math.floor(Date.now() / 1000);
    if (item.expiraEn < now) return null;

    return item.aprobadorId;
  } catch (error) {
    console.error('❌ Error en obtenerAprobadorIdPorToken:', error);
    return null;
  }
};

