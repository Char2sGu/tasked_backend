import { MikroORM } from '@mikro-orm/core';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { ModuleMetadata } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AuthModule } from 'src/auth/auth.module';
import { ClassroomsModule } from 'src/classrooms/classrooms.module';
import { Classroom } from 'src/classrooms/entities/classroom.entity';
import { JoinApplication } from 'src/join-applications/entities/join-application.entity';
import { JoinApplicationsModule } from 'src/join-applications/join-applications.module';
import { Membership } from 'src/memberships/entities/membership.entity';
import { MembershipsModule } from 'src/memberships/memberships.module';
import { User } from 'src/users/entities/user.entity';
import { UsersModule } from 'src/users/users.module';
import supertest from 'supertest';

export async function prepareE2E(
  metadata: ModuleMetadata = {},
  debug?: boolean,
) {
  const module = await Test.createTestingModule({
    ...metadata,
    imports: [
      MikroOrmModule.forRoot({
        type: 'sqlite',
        dbName: ':memory:',
        entities: [User, Membership, Classroom, JoinApplication],
        debug,
      }),
      AuthModule,
      UsersModule,
      MembershipsModule,
      ClassroomsModule,
      JoinApplicationsModule,
      ...(metadata.imports ?? []),
    ],
  }).compile();

  const schemaGenerator = module.get(MikroORM).getSchemaGenerator();
  await schemaGenerator.execute(await schemaGenerator.generate());

  const app = await module.createNestApplication().init();
  const requester = supertest(app.getHttpServer());

  return { module, app, requester };
}
