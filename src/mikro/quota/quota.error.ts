export class QuotaError<Entity> extends Error {
  constructor(
    public entity: Entity,
    public field: keyof Entity,
    public quota: number,
    public current: number,
  ) {
    super(
      `[${entity.constructor.name}.${field}]: Quota exceeded. (${current}/${quota})`,
    );
  }
}
