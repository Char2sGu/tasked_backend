import { Exclude } from 'class-transformer';
import { GenericEntity } from 'src/generic.entity';
import { Column, CreateDateColumn, Entity, UpdateDateColumn } from 'typeorm';
import { Gender } from '../gender.enum';

type UserAlias = User;

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    interface User extends UserAlias {}
  }
}

@Entity()
export class User extends GenericEntity {
  @Column({ unique: true })
  username: string;

  @Exclude()
  @Column()
  password: string;

  @Column({ default: Gender.Unknown })
  gender: Gender;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
