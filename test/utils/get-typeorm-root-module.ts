import { Type } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

export function getTypeOrmRootModule(...entities: Type[]) {
  return TypeOrmModule.forRoot({
    type: 'sqlite',
    database: ':memory:',
    autoLoadEntities: true,
    entities: entities,
    synchronize: true,
    keepConnectionAlive: true,
  });
}
