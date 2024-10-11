import { CorsOptions, CorsOptionsDelegate } from 'cors';
import { configDotenv } from 'dotenv';
configDotenv();
const allowedOrigin: string = process.env.CORS_ORIGIN as string;

const corsOptions: CorsOptions | CorsOptionsDelegate = {
  origin: (
    origin: string | undefined,
    callback: (err: Error | null, allow?: boolean) => void
  ) => {
    if (origin === allowedOrigin || !origin) {
      // Allow requests with no origin (e.g., mobile apps or curl requests)
      callback(null, true);
    } else {
      // Deny requests from other origins
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

export default corsOptions;
