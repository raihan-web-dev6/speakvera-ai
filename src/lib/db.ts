import mongoose from "mongoose";

/*
 * =====================================================
 * MONGODB URI
 * =====================================================
 */

function getMongoUri(): string {
  const uri =
    process.env.MONGODB_URI;

  if (!uri) {
    throw new Error(
      "MONGODB_URI is missing. Add it to your .env.local file."
    );
  }

  return uri;
}

/*
 * =====================================================
 * MONGOOSE CACHE TYPE
 * =====================================================
 */

type MongooseCache = {
  conn:
    typeof mongoose | null;

  promise:
    Promise<typeof mongoose> | null;
};

/*
 * =====================================================
 * GLOBAL CACHE
 * =====================================================
 *
 * In development, Next.js can reload modules many times.
 * Keeping the connection on globalThis prevents opening
 * a new MongoDB connection on every hot reload.
 */

const globalForMongoose =
  globalThis as unknown as {
    mongooseCache?:
      MongooseCache;
  };

const cached =
  globalForMongoose
    .mongooseCache ??
  (globalForMongoose.mongooseCache =
    {
      conn:
        null,

      promise:
        null,
    });

/*
 * =====================================================
 * CONNECT DATABASE
 * =====================================================
 */

export default async function connectDb() {
  /*
   * Already connected
   */

  if (
    cached.conn
  ) {
    return cached.conn;
  }

  /*
   * Create connection promise only once
   */

  if (
    !cached.promise
  ) {
    const mongoUri =
      getMongoUri();

    cached.promise =
      mongoose
        .connect(
          mongoUri,
          {
            bufferCommands:
              false,
          }
        )
        .then(
          (
            mongooseInstance
          ) =>
            mongooseInstance
        );
  }

  /*
   * Wait for connection
   */

  try {
    cached.conn =
      await cached.promise;
  } catch (error) {
    /*
     * Allow a new connection attempt
     * if the previous one failed.
     */

    cached.promise =
      null;

    throw error;
  }

  return cached.conn;
}