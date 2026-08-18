import mongoose from "mongoose";

// 1. Retrieve the MongoDB Connection URI from environment variables
const MONGODB_URI = process.env.MONGODB_URI;

// 2. Throw an explicit error if MONGODB_URI is not defined in environment variables
if (!MONGODB_URI) {
  throw new Error("Please define MONGODB_URI in .env.local");
}

// 3. Define interface for cached Mongoose connection object
interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

// 4. Extend Node.js global scope to persist cached connection across HMR in development
declare global {
  // eslint-disable-next-line no-var
  var mongooseCache: MongooseCache | undefined;
}

// 5. Initialize connection cache on globalThis if not present
if (!globalThis.mongooseCache) {
  globalThis.mongooseCache = {
    conn: null,
    promise: null,
  };
}

// Strictly typed cached reference guaranteed to be defined
const cached: MongooseCache = globalThis.mongooseCache;

/**
 * 6. Production-ready MongoDB connection handler using Mongoose.
 * Reuses active database connection across serverless invocations (Vercel)
 * and prevents multiple connection instances during Next.js development.
 */
export async function connectDB(): Promise<typeof mongoose> {
  // Return cached connection if database connection is already established
  if (cached.conn) {
    return cached.conn;
  }

  // If no connection promise exists, create a new connection promise
  if (!cached.promise) {
    const opts = {
      bufferCommands: false, // Disable Mongoose buffering to fail early if database connection is unavailable
    };

    cached.promise = mongoose.connect(MONGODB_URI as string, opts).then((mongooseInstance) => {
      return mongooseInstance;
    });
  }

  try {
    // Await database connection resolution and store connection instance in cache
    cached.conn = await cached.promise;
  } catch (error) {
    // Clear connection promise on failure to allow retry on subsequent requests
    cached.promise = null;
    throw error;
  }

  return cached.conn;
}

export default connectDB;
