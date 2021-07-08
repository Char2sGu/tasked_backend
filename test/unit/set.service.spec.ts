import { Test } from '@nestjs/testing';
import { SetService } from 'src/set.service';
import { buildKeyChecker } from 'test/utils';

const d = buildKeyChecker<SetService>();

describe(SetService.name, () => {
  let service: SetService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [SetService],
    }).compile();
    service = module.get(SetService);
  });

  let baseSet: Set<number>;
  let subSets: Set<number>[];
  let ret: Set<number>;

  describe(d('.union()'), () => {
    beforeEach(() => {
      baseSet = new Set([1, 2, 3]);
      subSets = [new Set([3, 4, 5]), new Set([4, 5, 6])];
      ret = service.union(baseSet, ...subSets);
    });

    it('should return the base set', () => {
      expect(ret).toBe(baseSet);
    });

    it('should unione all the elements', () => {
      const all = new Set([1, 2, 3, 4, 5, 6]);
      ret.forEach((v) => {
        expect(all.has(v));
        all.delete(v);
      });
      expect(all.size).toBe(0);
    });
  });

  describe(d('.intersect()'), () => {
    beforeEach(() => {
      baseSet = new Set([1, 2, 3]);
      subSets = [new Set([1, 2]), new Set([2, 3])];
      ret = service.intersect(baseSet, ...subSets);
    });

    it('should return the base set', () => {
      expect(ret).toBe(baseSet);
    });

    it('should intersect the elements', () => {
      expect(ret.size).toBe(1);
      expect(
        ret.forEach((v) => {
          expect(v).toBe(2);
        }),
      );
    });
  });

  describe(d('.difference()'), () => {
    beforeEach(() => {
      baseSet = new Set([1, 2, 3]);
      subSets = [new Set([1]), new Set([2])];
      ret = service.difference(baseSet, ...subSets);
    });

    it('should return the base set', () => {
      expect(ret).toBe(baseSet);
    });

    it('should difference the elements', () => {
      expect(ret.size).toBe(1);
      expect(
        ret.forEach((v) => {
          expect(v).toBe(3);
        }),
      );
    });
  });
});
