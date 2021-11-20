// eslint-disable-next-line @typescript-eslint/no-namespace
declare namespace NodeJS {
  interface ProcessEnv {
    DB_PATH: string;
    SECRET_KEY: string;
  }
}
