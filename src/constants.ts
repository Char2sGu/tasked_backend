export const TOKEN_VALIDITY_PERIOD = '4h';

export const TOKEN_LENGTH = 159;

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace NodeJS {
    interface ProcessEnv {
      DB_PATH: string;
      SECRET_KEY: string;
    }
  }
}
