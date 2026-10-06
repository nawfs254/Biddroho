import { MongoClient, Db, ObjectId } from 'mongodb';

const options = {
  serverSelectionTimeoutMS: 5000,
  connectTimeoutMS: 5000,
};

declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

function getClientPromise(): Promise<MongoClient> {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    return Promise.reject(
      new Error('MONGODB_URI environment variable is not defined in environment variables.')
    );
  }

  // Cache MongoClient across serverless invocations to prevent connection leaks
  if (!global._mongoClientPromise) {
    const client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
  }

  return global._mongoClientPromise;
}

// Lazy thenable clientPromise prevents top-level MongoClient crashes during build
const clientPromise: Promise<MongoClient> = {
  then(onfulfilled, onrejected) {
    return getClientPromise().then(onfulfilled, onrejected);
  },
  catch(onrejected) {
    return getClientPromise().catch(onrejected);
  },
  finally(onfinally) {
    return getClientPromise().finally(onfinally);
  },
  [Symbol.toStringTag]: 'Promise',
} as Promise<MongoClient>;

export async function getDatabase(): Promise<Db> {
  const dbName = process.env.MONGODB_DB || 'biddroho';
  const client = await clientPromise;
  return client.db(dbName);
}

export async function isDatabaseConnected(): Promise<boolean> {
  try {
    const dbName = process.env.MONGODB_DB || 'biddroho';
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
