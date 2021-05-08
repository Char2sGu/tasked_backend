import { TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { EntityClassOrSchema } from '@nestjs/typeorm/dist/interfaces/entity-class-or-schema.type';

export function getRepositories(
  module: TestingModule,
  ...entities: EntityClassOrSchema[]
) {
  return entities.map((entity) => module.get(getRepositoryToken(entity)));
}
