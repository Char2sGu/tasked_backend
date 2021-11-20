import { config } from 'dotenv';

config();

export const DB_PATH = process.env.DB_PATH;

export const SECRET_KEY = process.env.SECRET_KEY;

export const DEBUG =
  process.env.DEBUG == 'true'
    ? true
    : process.env.DEBUG == 'false'
    ? false
    : undefined;
