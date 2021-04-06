import { Expose } from 'class-transformer';
import { GenericEntity } from 'src/generic.entity';
import { TransformedInterceptor } from 'src/transformed.interceptor';

describe('TransformedInterceptor', () => {
  class TestEntity extends GenericEntity {
    @Expose() exposed: number;
    notExposed: number;
  }

  const entity = Object.create(TestEntity.prototype);
  const interceptor = new TransformedInterceptor(2);

  it('should be defined', () => {
    expect(interceptor).toBeDefined();
  });

  describe(`#${TransformedInterceptor.prototype.mapEntities.name}()`, () => {
    it.each([
      [{}, 0],
      [0, 0],
      ['', 0],
      [null, 0],
      [undefined, 0],
      [entity, 1],
      [[entity], 1],
      [[entity, [entity]], 2],
      [[entity, [entity], [[entity]]], 2],
      [{ k: entity }, 1],
      [{ k1: entity, k2: { k: entity } }, 2],
      [{ k1: entity, k2: { k: entity }, k3: { k: { document: entity } } }, 2],
    ])('should call the callback for proper times', (value, expectedCount) => {
      let count = 0;
      interceptor.mapEntities(value, () => count++);
      expect(count).toBe(expectedCount);
    });
  });
});
