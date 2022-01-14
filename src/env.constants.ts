import { config } from 'dotenv';

config();

export const PORT = Number(process.env.PORT);

export const DB_PATH = process.env.DB_PATH;

export const SECRET_KEY = process.env.SECRET_KEY;

export const GRAPHQL_FREQUENCY_LIMIT = Number(
  process.env.GRAPHQL_FREQUENCY_LIMIT,
);

export const GRAPHQL_FREQUENCY_DURATION = Number(
  process.env.GRAPHQL_FREQUENCY_DURATION,
);

export const GRAPHQL_COMPLEXITY = Number(process.env.GRAPHQL_COMPLEXITY);

export const GRAPHQL_DEPTH = Number(process.env.GRAPHQL_DEPTH);

export const DEBUG =
  process.env.DEBUG == 'true'
    ? true
    : process.env.DEBUG == 'false'
    ? false
    : undefined;
