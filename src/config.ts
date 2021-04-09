import { config } from 'dotenv';

config();

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace NodeJS {
    interface ProcessEnv {
      DB_PATH: string;
      SECRET_KEY: string;
      TOKEN_EXPIRY: string;
    }
  }
}
