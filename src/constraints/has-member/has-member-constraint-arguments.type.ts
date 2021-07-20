export type HasMemberConstraintArguments<T = unknown> = [
  (string & keyof T) | undefined,
];
