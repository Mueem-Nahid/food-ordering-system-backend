import mongoose from 'mongoose';
import { Server } from 'http';
import app from './app';
import config from './config';

process.on('uncaughtException', error => {
  console.log('Uncaught exception:', error);
  process.exit(1);
});

let server: Server;

// database connection
async function bootstrap() {
  try {
    await mongoose.connect(config.database_url as string, {
      serverApi: { version: '1', strict: true, deprecationErrors: true },
      serverSelectionTimeoutMS: 30000,
      retryWrites: true,
    });
    console.log('Database connection successful !!!');
    server = app.listen(config.port, () => {
      console.log(`Server listening on port ${config.port} ...`);
    });
  } catch (error) {
    console.log('Failed to connect database.', error);
    process.exit(1);
  }

  process.on('unhandledRejection', error => {
    if (server) {
      server.close(() => {
        console.log('Unhandled rejection:', error);
        process.exit(1);
      });
    } else {
      process.exit(1);
    }
  });
}

bootstrap();

process.on('SIGTERM', () => {
  console.log('SIGTERM received');
  if (server) {
    server.close();
  }
});
