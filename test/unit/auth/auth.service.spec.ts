import { EntityRepository } from '@mikro-orm/core';
import { getRepositoryToken } from '@mikro-orm/nestjs';
import { TestingModule } from '@nestjs/testing';
import { AuthService } from 'src/auth/auth.service';
import { User } from 'src/users/entities/user.entity';
import { buildKeyChecker, prepareE2E } from 'test/utils';

describe(AuthService.name, () => {
  const d = buildKeyChecker<AuthService>();

  let module: TestingModule;
  let repository: EntityRepository<User>;
  let service: AuthService;

  beforeEach(async () => {
    ({ module } = await prepareE2E());

    service = module.get<AuthService>(AuthService);
    repository = module.get(getRepositoryToken(User));

    repository.persist(
      repository.create({ username: 'username', password: 'password' }),
    );
    await repository.flush();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe(d('#obtainJwt()'), () => {
    it('should return a token when passed legal data', async () => {
      const token = await service.obtainJwt('username', 'password');
      expect(typeof token).toBe('string');
    });

    it('should return nothing when passed illegal data', async () => {
      const token = await service.obtainJwt('', '');
      expect(token).toBeUndefined();
    });
  });

  describe(d('#getExpirationDate()'), () => {
    it('should return a valid `Date`', () => {
      const date = service.getExpirationDate();
      expect(date.constructor).toBe(Date);
      expect(isNaN(date.getTime())).toBe(false);
    });
  });
});
