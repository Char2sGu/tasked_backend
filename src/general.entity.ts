import { PrimaryGeneratedColumn } from 'typeorm';

export class GeneralEntity {
  @PrimaryGeneratedColumn()
  id: number;
}
