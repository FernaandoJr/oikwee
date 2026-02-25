import { MongoClient } from 'mongodb';
import { MONGODB_URI } from '../constants/envs.js';

const uri = MONGODB_URI;

const client = new MongoClient(uri);
export { client };

export const db = client.db();
