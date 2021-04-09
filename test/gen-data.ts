import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';

const cachePools: {
  users: Record<string, User[]>;
} = {
  users: {},
};

export async function genUsers(
  repository: Repository<User>,
  count: number,
  cacheToken?: string,
) {
  await repository.clear();

  if (!(cacheToken in cachePools.users)) cachePools.users[cacheToken] = [];
  const entities = cachePools.users[cacheToken];

  if (!entities.length)
    for (let i = 1; i <= count; i++) {
      const entity = repository.create({
        username: `username${i}`,
        password: `password${i}`,
      });
      entities.push(await repository.save(entity));
    }
  else await repository.insert(entities);

  return entities;
}
