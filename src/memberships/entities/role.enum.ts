import { registerEnumType } from '@nestjs/graphql';

export enum Role {
  Student = 'STUDENT',
  Teacher = 'TEACHER',
}

registerEnumType(Role, { name: 'Role' });
