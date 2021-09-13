import { Injectable } from '@nestjs/common';

@Injectable()
export class SetService {
  union<T>(base: Set<T>, ...sets: Set<T>[]) {
    sets.forEach((set) => set.forEach((v) => base.add(v)));
    return base;
  }

  intersect<T>(base: Set<T>, ...sets: Set<T>[]) {
    base.forEach((v) => {
      if (sets.some((set) => !set.has(v))) base.delete(v);
    });
    return base;
  }

  difference<T>(base: Set<T>, ...sets: Set<T>[]) {
    sets.forEach((set) => set.forEach((v) => base.delete(v)));
    return base;
  }

  for<T>(set: Set<T>) {
    const handler = {
      union: (...sets: Set<T>[]) => {
        this.union(set, ...sets);
        return handler;
      },
      intersect: (...sets: Set<T>[]) => {
        this.intersect(set, ...sets);
        return handler;
      },
      difference: (...sets: Set<T>[]) => {
        this.difference(set, ...sets);
        return handler;
      },
      get result() {
        return set;
      },
    };
    return handler;
  }
}
