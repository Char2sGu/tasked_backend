export class CrudModuleOptions<Entity> {
  soft?: DateField<Entity>;
}

type DateField<Entity> = {
  [Field in keyof Entity]: Date extends Entity[Field] ? Field : never;
}[keyof Entity];
