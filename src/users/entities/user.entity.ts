import { hash } from 'bcryptjs';
import { Exclude } from 'class-transformer';
import dayjs from 'dayjs';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Gender } from '../gender.enum';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

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

  get isUpdatedRecently() {
    const DAYS = 3;
    return dayjs(this.updatedAt).isAfter(dayjs().subtract(DAYS, 'd'));
  }

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    const HASHED_LENGTH = 60;
    if (this.password.length == HASHED_LENGTH) return;
    this.password = await hash(this.password, 10);
  }
}

type UserEntity = User;

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    interface User extends UserEntity {}
  }
}
