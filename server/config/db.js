import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    /* =========================
       CONNECT TO MONGODB
    ========================= */
    const conn = await mongoose.connect(
      process.env.MONGODB_URI,
      {
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
        autoIndex: true,
      }
    );

    /* =========================
       DATABASE INFO
    ========================= */
    console.log(
      `✅ MongoDB Connected: ${conn.connection.host}`
    );

    console.log(
      `📊 Database Name: ${conn.connection.name}`
    );

    console.log(
      `🔗 Connection State: ${
        mongoose.connection.readyState === 1
          ? 'Connected'
          : 'Disconnected'
      }`
    );

    /* =========================
       GET MONGODB VERSION
    ========================= */
    try {
      const admin =
        conn.connection.db.admin();

      const info =
        await admin.serverStatus();

      console.log(
        `📦 MongoDB Version: ${info.version}`
      );
    } catch (versionError) {
      console.log(
        '⚠️ Could not fetch MongoDB version'
      );
    }

    /* =========================
       CONNECTION EVENTS
    ========================= */
    mongoose.connection.on(
      'connected',
      () => {
        console.log(
          '✅ MongoDB connection established'
        );
      }
    );

    mongoose.connection.on(
      'error',
      (err) => {
        console.error(
          `❌ MongoDB Connection Error: ${err.message}`
        );
      }
    );

    mongoose.connection.on(
      'disconnected',
      () => {
        console.log(
          '⚠️ MongoDB disconnected'
        );
      }
    );

    mongoose.connection.on(
      'reconnected',
      () => {
        console.log(
          '✅ MongoDB reconnected'
        );
      }
    );

    /* =========================
       GRACEFUL SHUTDOWN
    ========================= */
    const gracefulShutdown = async (
      signal
    ) => {
      console.log(
        `\n🔴 ${signal} received. Closing MongoDB connection...`
      );

      try {
        await mongoose.connection.close();

        console.log(
          '✅ MongoDB connection closed successfully'
        );

        process.exit(0);
      } catch (error) {
        console.error(
          '❌ Error closing MongoDB connection:',
          error.message
        );

        process.exit(1);
      }
    };

    /* =========================
       REMOVE DUPLICATE LISTENERS
    ========================= */
    process.removeAllListeners(
      'SIGINT'
    );

    process.removeAllListeners(
      'SIGTERM'
    );

    /* =========================
       HANDLE TERMINATION
    ========================= */
    process.on('SIGINT', () =>
      gracefulShutdown('SIGINT')
    );

    process.on('SIGTERM', () =>
      gracefulShutdown('SIGTERM')
    );

    return conn;
  } catch (error) {
    /* =========================
       CONNECTION ERRORS
    ========================= */
    console.error(
      `❌ MongoDB Connection Failed: ${error.message}`
    );

    /* =========================
       SERVER SELECTION ERROR
    ========================= */
    if (
      error.name ===
      'MongooseServerSelectionError'
    ) {
      console.error(
        '\n⚠️ Could not connect to MongoDB server.'
      );

      console.error(
        'Please check the following:'
      );

      console.error(
        '1. Is MongoDB running?'
      );

      console.error(
        '2. Is your MONGODB_URI correct?'
      );

      console.error(
        '3. Is firewall/internet blocking MongoDB?'
      );
    }

    /* =========================
       INVALID URI ERROR
    ========================= */
    if (
      error.name === 'MongoParseError'
    ) {
      console.error(
        '\n⚠️ Invalid MongoDB connection string'
      );

      console.error(
        'Example: mongodb://127.0.0.1:27017/carside_db'
      );
    }

    /* =========================
       AUTHENTICATION ERROR
    ========================= */
    if (
      error.name ===
      'MongoServerError'
    ) {
      console.error(
        '\n⚠️ MongoDB authentication failed'
      );

      console.error(
        'Please verify username/password in MONGODB_URI'
      );
    }

    /* =========================
       PRODUCTION MODE
    ========================= */
    if (
      process.env.NODE_ENV ===
      'production'
    ) {
      console.log(
        '⚠️ Continuing despite DB connection failure...'
      );

      return null;
    }

    /* =========================
       DEVELOPMENT MODE
    ========================= */
    process.exit(1);
  }
};

/* =========================
   CHECK CONNECTION STATUS
========================= */
export const isDbConnected = () => {
  return (
    mongoose.connection.readyState === 1
  );
};

/* =========================
   GET DATABASE STATS
========================= */
export const getDbStats =
  async () => {
    if (!isDbConnected()) {
      return {
        error:
          'Database is not connected',
      };
    }

    try {
      const stats =
        await mongoose.connection.db.stats();

      return {
        database:
          mongoose.connection.name,

        collections:
          stats.collections,

        documents:
          stats.objects,

        dataSize:
          (
            stats.dataSize /
            1024 /
            1024
          ).toFixed(2) + ' MB',

        storageSize:
          (
            stats.storageSize /
            1024 /
            1024
          ).toFixed(2) + ' MB',

        indexes:
          stats.indexes,

        indexSize:
          (
            stats.indexSize /
            1024 /
            1024
          ).toFixed(2) + ' MB',
      };
    } catch (error) {
      console.error(
        '❌ Error getting DB stats:',
        error.message
      );

      return {
        error:
          'Could not fetch database statistics',
      };
    }
  };

export default connectDB;