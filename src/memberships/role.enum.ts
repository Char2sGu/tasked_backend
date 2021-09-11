import { registerEnumType } from '@nestjs/graphql';

export enum Role {
  Student = 'student',
  Teacher = 'teacher',
}

registerEnumType(Role, { name: 'Role' });
