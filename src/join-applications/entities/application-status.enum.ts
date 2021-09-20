import { registerEnumType } from '@nestjs/graphql';

export enum ApplicationStatus {
  Accepted = 'ACCEPTED',
  Rejected = 'REJECTED',
  Pending = 'PENDING',
}

registerEnumType(ApplicationStatus, { name: 'ApplicationStatus' });
