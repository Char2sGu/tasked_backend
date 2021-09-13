import { SKIP_AUTH } from './skip-auth.symbol';

export const SkipAuth = (): MethodDecorator => (prototype, key, descriptor) =>
  Reflect.defineMetadata(SKIP_AUTH, true, descriptor.value);
