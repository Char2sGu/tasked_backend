import { PrimaryGeneratedColumn } from 'typeorm';

export abstract class GenericEntity {
  @PrimaryGeneratedColumn()
  id: number;
}
