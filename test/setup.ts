import { config } from 'dotenv';

export default async function () {
  config();
  process.env.DB_PATH = ':memory:';
}
