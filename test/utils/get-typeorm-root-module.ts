import { TypeOrmModule } from '@nestjs/typeorm';

export function getTypeOrmRootModule() {
  return TypeOrmModule.forRoot({
    type: 'sqlite',
    database: ':memory:',
    autoLoadEntities: true,
    synchronize: true,
    keepConnectionAlive: true,
  });
}
