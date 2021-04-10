import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { getTypeOrmRootModule } from 'src/app.module';
import { AuthModule } from 'src/auth/auth.module';
import { AuthService } from 'src/auth/auth.service';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { insertUsers } from 'test/insert-data';

describe(AuthService.name, () => {
  const COUNT = 1;
  const username = `username${COUNT}`;
  const password = `password${COUNT}`;

  let repository: Repository<User>;
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [getTypeOrmRootModule(true), AuthModule],
    }).compile();

    service = module.get<AuthService>(AuthService);
    repository = module.get(getRepositoryToken(User));
    await insertUsers(repository, COUNT, AuthService.name);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe(`#${AuthService.prototype.obtainJwt.name}()`, () => {
    it('should return a token when passed legal data', async () => {
      const token = await service.obtainJwt(username, password);
      expect(typeof token).toBe('string');
    });

    it('should return nothing when passed illegal data', async () => {
      const token = await service.obtainJwt('', '');
      expect(token).toBeUndefined();
    });
  });

  describe(`#${AuthService.prototype.getExpirationDate.name}()`, () => {
    it('should return a valid `Date`', () => {
      const date = service.getExpirationDate();
      expect(date.constructor).toBe(Date);
      expect(isNaN(date.getTime())).toBe(false);
    });
  });
});
