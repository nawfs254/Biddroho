import { MongoClient, Db, ObjectId } from 'mongodb';

const uri = process.env.MONGODB_URI || '';
const dbName = process.env.MONGODB_DB || 'biddroho';

if (!uri && process.env.NODE_ENV !== 'test') {
  console.warn('⚠️ MONGODB_URI environment variable is not defined in .env.local');
}

const options = {
  serverSelectionTimeoutMS: 5000,
  connectTimeoutMS: 5000,
};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

if (process.env.NODE_ENV === 'development') {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR.
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  // In production mode, it's best to not use a global variable.
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export async function getDatabase(): Promise<Db> {
  const client = await clientPromise;
  return client.db(dbName);
}

export async function isDatabaseConnected(): Promise<boolean> {
  try {
    const client = await clientPromise;
    await client.db(dbName).command({ ping: 1 });
    return true;
  } catch (err) {
    console.error('Database connection ping failed:', err);
    return false;
  }
}

export function toMongoQuery(id: string): any {
  if (ObjectId.isValid(id) && String(new ObjectId(id)) === id) {
    return { _id: new ObjectId(id) };
  }
  return { _id: id };
}

export default clientPromise;
