import { registerEnumType } from '@nestjs/graphql';

export enum ApplicationStatus {
  Accepted = 'accepted',
  Rejected = 'rejected',
  Pending = 'pending',
}

registerEnumType(ApplicationStatus, { name: 'ApplicationStatus' });
