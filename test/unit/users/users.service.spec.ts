import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { compare } from 'bcryptjs';
import { randomInt } from 'crypto';
import { getTypeOrmRootModule } from 'src/app.module';
import { User } from 'src/users/entities/user.entity';
import { UsersModule } from 'src/users/users.module';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';
import { insertUsers } from 'test/insert-data';

describe(UsersService.name, () => {
  const COUNT = 3;
  const username = `username${randomInt(1, COUNT)}`;

  let repository: Repository<User>;
  let users: User[];
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [getTypeOrmRootModule(true), UsersModule],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repository = module.get(getRepositoryToken(User));
    users = await insertUsers(repository, COUNT, UsersService.name);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe(`#${UsersService.prototype.create.name}()`, () => {
    it('should create an entity with password hashed', async () => {
      const entity = await service.create({
        username: 'create',
        password: 'create ',
      });

      expect(typeof entity.password).toBe('string');
      expect(entity.password).not.toBe('create');
    });
  });

  describe(`#${UsersService.prototype.findMany.name}()`, () => {
    it.each([
      [() => undefined, undefined, COUNT],
      [() => users[0].id, undefined, COUNT - 1],
      [() => users[0].id, 1, 1],
      [() => undefined, COUNT - 1, COUNT - 1],
    ])('should return the specified entities', async (after, limit, length) => {
      const entites = await service.findMany(after(), limit);
      expect(entites.length).toBe(length);
    });
  });

  describe(`#${UsersService.prototype.findOne.name}()`, () => {
    it('should return the target entity when it exists', async () => {
      const entity = await service.findOne(username);
      expect(entity.username).toBe(username);
    });

    it('should return nothing when the target not exists', async () => {
      const ret = await service.findOne('notexists');
      expect(ret).toBeUndefined();
    });
  });

  describe(`#${UsersService.prototype.update.name}()`, () => {
    it('should update and return the target entity with password hashed when it exists', async () => {
      const password = 'newpwd';
      const entity = await service.update(username, { password });
      expect(await compare(password, entity.password)).toBe(true);
    });

    it('should return nothing when the target not exists', async () => {
      const ret = await service.update('notexists', {});
      expect(ret).toBeUndefined();
    });
  });

  describe(`#${UsersService.prototype.remove.name}()`, () => {
    it('should remove and return the entity when it exists', async () => {
      const entity = await service.remove(username);
      expect(entity).toBeDefined();
      expect(await repository.findOne({ username })).toBeUndefined();
    });

    it('should return nothing when the target not exists', async () => {
      const ret = await service.remove('notexists');
      expect(ret).toBeUndefined();
    });
  });

  describe(`#${UsersService.prototype.count.name}()`, () => {
    it('should return the count of all the entities', async () => {
      expect(await service.count()).toBe(COUNT);
    });
  });
});
