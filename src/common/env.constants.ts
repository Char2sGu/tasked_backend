import { config } from 'dotenv';
import { env } from 'process';

config();

const num = (v: string) => Number(v);
const str = (v: string) => v;
const bool = (v: string) =>
  v == 'true' ? true : v == 'false' ? false : undefined;

export const PORT = num(env.PORT);
export const DB_PATH = str(env.DB_PATH);
export const SECRET_KEY = str(env.SECRET_KEY);
export const GRAPHQL_FREQUENCY_LIMIT = num(env.GRAPHQL_FREQUENCY_LIMIT);
export const GRAPHQL_FREQUENCY_DURATION = num(env.GRAPHQL_FREQUENCY_DURATION);
export const GRAPHQL_COMPLEXITY = num(env.GRAPHQL_COMPLEXITY);
export const GRAPHQL_DEPTH = num(env.GRAPHQL_DEPTH);
export const DEBUG = bool(env.DEBUG);
