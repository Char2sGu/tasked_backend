// eslint-disable-next-line @typescript-eslint/no-namespace
declare namespace NodeJS {
  interface ProcessEnv {
    PORT: string;
    DB_PATH: string;
    SECRET_KEY: string;
    DEBUG: string;
  }
}
