import { Exclude } from 'class-transformer';
import { GeneralEntity } from 'src/general.entity';
import { Column, CreateDateColumn, Entity } from 'typeorm';
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
export class User extends GeneralEntity {
  @Column()
  username: string;

  @Exclude()
  @Column()
  password: string;

  @Column({ default: Gender.Unknown })
  gender: Gender;

  @CreateDateColumn()
  createdAt: Date;
}
