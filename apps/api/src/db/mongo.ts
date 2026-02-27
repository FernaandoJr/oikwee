import { MongoClient } from 'mongodb';
import { env } from '../constants/envs.js';

const uri = env.MONGODB_URI;

const client = new MongoClient(uri, {
  connectTimeoutMS: 10_000,
  serverSelectionTimeoutMS: 10_000,
});

export { client };

export const db = client.db();

export async function connect(): Promise<void> {
  await client.connect();
}
