import { config } from 'dotenv';

config();

export const PORT = Number(process.env.PORT);

export const DB_PATH = process.env.DB_PATH;

export const SECRET_KEY = process.env.SECRET_KEY;

export const THROTTLER_TTL = Number(process.env.THROTTLER_TTL);

export const THROTTLER_LIMIT = Number(process.env.THROTTLER_LIMIT);

export const MAX_COMPLEXITY = Number(process.env.MAX_COMPLEXITY);

export const MAX_DEPTH = Number(process.env.MAX_DEPTH);

export const DEBUG =
  process.env.DEBUG == 'true'
    ? true
    : process.env.DEBUG == 'false'
    ? false
    : undefined;
