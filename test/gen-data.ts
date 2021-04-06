import { hash } from 'bcryptjs';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';

export async function genUsers(repository: Repository<User>, count: number) {
  const ret: User[] = [];
  await repository.clear();
  for (let i = 1; i <= count; i++) {
    const entity = repository.create({
      username: `username${i}`,
      password: await hash(`password${i}`, 10),
    });
    ret.push(await repository.save(entity));
  }
  return ret;
}
