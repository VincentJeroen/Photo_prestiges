import { MongoClient } from 'mongodb';

console.log(process.env.MONGO_URL);

const uri = process.env.MONGO_URL;
const client = new MongoClient(uri);
const db = client.db(process.env.DB_NAME);

export { db, client };
