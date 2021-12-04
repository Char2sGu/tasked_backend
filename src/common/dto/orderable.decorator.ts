export const Orderable =
  (): PropertyDecorator =>
  ({ constructor: target }, field: string) => {
    const fields: Set<string> =
      Reflect.getMetadata(ORDERABLE, target) ?? new Set();
    Reflect.defineMetadata(ORDERABLE, fields.add(field), target);
  };

export const ORDERABLE = Symbol('orderable');
