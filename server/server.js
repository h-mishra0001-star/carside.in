import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

import connectDB from './config/db.js';

// Routes
import carRoutes from './routes/cars.js';
import brandRoutes from './routes/brands.js';
import bookingRoutes from './routes/bookings.js'; // ✅ FIXED
import authRoutes from './routes/auth.js';
import adminRoutes from './routes/admin.js';

// Middleware
import {
  errorHandler,
  notFound,
} from './middleware/errorHandler.js';

import {
  generalLimiter,
} from './middleware/rateLimiter.js';

dotenv.config();

const app = express();

const PORT = process.env.PORT || 5000;

/* =================================
   SECURITY MIDDLEWARE
================================= */
app.use(
  helmet({
    crossOriginResourcePolicy: {
      policy: 'cross-origin',
    },
    contentSecurityPolicy: false,
  })
);

/* =================================
   CORS CONFIGURATION
================================= */
app.use(
  cors({
    origin:
      process.env.CLIENT_URL ||
      'http://localhost:5173',

    credentials: true,

    methods: [
      'GET',
      'POST',
      'PUT',
      'DELETE',
      'PATCH',
      'OPTIONS',
    ],

    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'X-Requested-With',
    ],
  })
);

/* =================================
   RATE LIMITER
================================= */
if (generalLimiter) {
  app.use('/api', generalLimiter);
}

/* =================================
   BODY PARSER
================================= */
app.use(
  express.json({
    limit: '10mb',
  })
);

app.use(
  express.urlencoded({
    extended: true,
    limit: '10mb',
  })
);

/* =================================
   REQUEST LOGGER
================================= */
if (
  process.env.NODE_ENV ===
  'development'
) {
  app.use((req, res, next) => {
    console.log(
      `📝 ${req.method} ${req.originalUrl}`
    );

    next();
  });
}

/* =================================
   API TEST ROUTE
================================= */
app.get('/api/test', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'API is working properly',
    timestamp: new Date().toISOString(),
  });
});

/* =================================
   HEALTH CHECK ROUTE
================================= */
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    status: 'OK',

    database:
      mongoose.connection.readyState === 1
        ? 'Connected'
        : 'Disconnected',

    uptime: process.uptime(),

    environment:
      process.env.NODE_ENV ||
      'development',

    timestamp: new Date().toISOString(),
  });
});

/* =================================
   ROOT ROUTE
================================= */
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    name: 'Carside API',
    version: '1.0.0',
    status: 'Running',

    endpoints: {
      home: '/',
      health: '/health',
      test: '/api/test',
      cars: '/api/cars',
      brands: '/api/brands',
      bookings: '/api/bookings',
      auth: '/api/auth',
      admin: '/api/admin',
    },
  });
});

/* =================================
   MAIN ROUTES
================================= */
app.use('/api/cars', carRoutes);

app.use('/api/brands', brandRoutes);

app.use('/api/bookings', bookingRoutes);

app.use('/api/auth', authRoutes);

app.use('/api/admin', adminRoutes);

/* =================================
   404 HANDLER
================================= */
app.use(notFound || ((req, res) => {
  console.log(
    `[${new Date().toISOString()}] 404 - ${req.method} ${req.originalUrl}`
  );

  res.status(404).json({
    success: false,
    message: `Route not found: ${req.originalUrl}`,
  });
}));

/* =================================
   GLOBAL ERROR HANDLER
================================= */
app.use(errorHandler || ((err, req, res, next) => {
  console.error('❌ Global Error:', err);

  res.status(
    err.statusCode || 500
  ).json({
    success: false,
    message:
      err.message ||
      'Internal Server Error',
  });
}));

/* =================================
   START SERVER FUNCTION
================================= */
const startServer = async () => {
  try {
    await connectDB();

    console.log(
      '✅ Database connected successfully'
    );

    const server = app.listen(
      PORT,
      () => {
        console.log(
          '\n===================================='
        );

        console.log(
          '🚀 SERVER STARTED SUCCESSFULLY'
        );

        console.log(
          '===================================='
        );

        console.log(
          `🌍 Server URL : http://localhost:${PORT}`
        );

        console.log(
          `📡 API URL    : http://localhost:${PORT}/api`
        );

        console.log(
          `🏥 Health URL : http://localhost:${PORT}/health`
        );

        console.log(
          `🛢️ Database   : ${mongoose.connection.name}`
        );

        console.log(
          `📅 Started At : ${new Date().toLocaleString()}`
        );

        console.log(
          '====================================\n'
        );
      }
    );

    /* =============================
       UNHANDLED REJECTION
    ============================== */
    process.on(
      'unhandledRejection',
      (err) => {
        console.error(
          '❌ Unhandled Rejection:',
          err.message
        );

        server.close(() => {
          process.exit(1);
        });
      }
    );

    /* =============================
       UNCAUGHT EXCEPTION
    ============================== */
    process.on(
      'uncaughtException',
      (err) => {
        console.error(
          '❌ Uncaught Exception:',
          err.message
        );

        process.exit(1);
      }
    );

    /* =============================
       GRACEFUL SHUTDOWN
    ============================== */
    const gracefulShutdown =
      async (signal) => {
        console.log(
          `\n🔴 ${signal} received`
        );

        try {
          server.close(async () => {
            console.log(
              '✅ HTTP Server Closed'
            );

            await mongoose.connection.close();

            console.log(
              '✅ MongoDB Connection Closed'
            );

            process.exit(0);
          });
        } catch (error) {
          console.error(
            '❌ Shutdown Error:',
            error.message
          );

          process.exit(1);
        }
      };

    process.on(
      'SIGINT',
      () =>
        gracefulShutdown(
          'SIGINT'
        )
    );

    process.on(
      'SIGTERM',
      () =>
        gracefulShutdown(
          'SIGTERM'
        )
    );
  } catch (error) {
    console.error(
      '❌ Failed to start server:',
      error.message
    );

    process.exit(1);
  }
};

/* =================================
   START APPLICATION
================================= */
startServer();

export default app;