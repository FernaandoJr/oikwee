import { MongoClient } from 'mongodb';
import { env } from '../constants/envs.js';

const uri = env.MONGODB_URI;

const client = new MongoClient(uri);
export { client };

export const db = client.db();
