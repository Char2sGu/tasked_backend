import { config } from 'dotenv';

config();

export const DB_PATH = process.env.DB_PATH;
export const SECRET_KEY = process.env.SECRET_KEY;

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace NodeJS {
    interface ProcessEnv {
      DB_PATH: string;
      SECRET_KEY: string;
    }
  }
}
