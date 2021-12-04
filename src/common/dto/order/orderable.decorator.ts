export const Orderable =
  (): PropertyDecorator =>
  ({ constructor: target }, field: string) => {
    const fields: Set<string> =
      Reflect.getOwnMetadata(ORDERABLE, target) ??
      new Set(Reflect.getMetadata(ORDERABLE, target)); // inherit parent metadata
    Reflect.defineMetadata(ORDERABLE, fields.add(field), target);
  };

export const ORDERABLE = Symbol('orderable');
