import { MikroORM } from '@mikro-orm/core';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { ModuleMetadata } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { Affair } from 'src/affairs/entities/affair.entity';
import { AppModule } from 'src/app.module';
import { Classroom } from 'src/classrooms/entities/classroom.entity';
import { JoinApplication } from 'src/join-applications/entities/join-application.entity';
import { Membership } from 'src/memberships/entities/membership.entity';
import { User } from 'src/users/entities/user.entity';
import supertest from 'supertest';

export async function prepareE2E(
  metadata: ModuleMetadata = {},
  debug?: boolean,
) {
  const module = await Test.createTestingModule({
    imports: [
      MikroOrmModule.forRoot({
        type: 'sqlite',
        dbName: ':memory:',
        entities: [User, Membership, Classroom, JoinApplication, Affair],
        debug,
      }),
      ...(Reflect.getMetadata('imports', AppModule) as any[]).slice(1),
      ...(metadata.imports ?? []),
    ],
    controllers: [
      ...(Reflect.getMetadata('controllers', AppModule) ?? []),
      ...(metadata.controllers ?? []),
    ],
    providers: [
      ...(Reflect.getMetadata('providers', AppModule) ?? []),
      ...(metadata.providers ?? []),
    ],
  }).compile();

  const schemaGenerator = module.get(MikroORM).getSchemaGenerator();
  await schemaGenerator.execute(await schemaGenerator.generate());

  const app = module.createNestApplication();
  await app.listen(0); // start own http server, otherwise supertest will create one internally
  const requester = supertest(app.getHttpServer());

  return { module, app, requester };
}
