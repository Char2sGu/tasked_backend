/**
 * Temporary monkey patch for PR https://github.com/nestjsx/crud/pull/692
 */

import { CrudRequest } from '@nestjsx/crud';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { hasLength, isObject, objKeys } from '@nestjsx/util';
import { oO } from '@zmotivat0r/o0';
import { plainToClass } from 'class-transformer';
import { DeepPartial } from 'typeorm';

TypeOrmCrudService.prototype.updateOne = async function updateOne(
  req: CrudRequest,
  dto: DeepPartial<unknown>,
) {
  const {
    allowParamsOverride,
    returnShallow,
  } = req.options.routes.updateOneBase;
  const paramsFilters = this.getParamFilters(req.parsed);
  const found = await this.getOneOrFail(req, returnShallow);
  const toSave = !allowParamsOverride
    ? { ...found, ...dto, ...paramsFilters, ...req.parsed.authPersist }
    : { ...found, ...dto, ...req.parsed.authPersist };
  const updated = await this.repo.save(
    plainToClass(this.entityType, toSave, { ignoreDecorators: true }),
  );

  if (returnShallow) {
    return updated;
  } else {
    req.parsed.paramsFilter.forEach((filter) => {
      filter.value = updated[filter.field];
    });

    return this.getOneOrFail(req);
  }
};

TypeOrmCrudService.prototype.replaceOne = async function replaceOne(
  req: CrudRequest,
  dto: DeepPartial<unknown>,
) {
  const {
    allowParamsOverride,
    returnShallow,
  } = req.options.routes.replaceOneBase;
  const paramsFilters = this.getParamFilters(req.parsed);
  const found: any = (await oO(this.getOneOrFail(req, returnShallow)))[1];
  const toSave = !allowParamsOverride
    ? { ...(found || {}), ...dto, ...paramsFilters, ...req.parsed.authPersist }
    : {
        ...(found || {}),
        ...paramsFilters,
        ...dto,
        ...req.parsed.authPersist,
      };
  const replaced = await this.repo.save(
    plainToClass(this.entityType, toSave, { ignoreDecorators: true }),
  );

  if (returnShallow) {
    return replaced;
  } else {
    const primaryParams = this.getPrimaryParams(req.options);

    if (!primaryParams.length) {
      return replaced;
    }

    req.parsed.search = primaryParams.reduce(
      (acc, p) => ({ ...acc, [p]: replaced[p] }),
      {},
    );
    return this.getOneOrFail(req);
  }
};

TypeOrmCrudService.prototype.deleteOne = async function deleteOne(
  req: CrudRequest,
) {
  const { returnDeleted } = req.options.routes.deleteOneBase;
  const found = await this.getOneOrFail(req, returnDeleted);
  const toReturn = returnDeleted
    ? plainToClass(this.entityType, { ...found }, { ignoreDecorators: true })
    : undefined;
  req.options.query.softDelete === true
    ? await this.repo.softRemove(found)
    : await this.repo.remove(found);
  return toReturn;
};

// eslint-disable-next-line
// @ts-expect-error
TypeOrmCrudService.prototype.prepareEntityBeforeSave = function prepareEntityBeforeSave(
  dto: DeepPartial<unknown>,
  parsed: CrudRequest['parsed'],
): unknown {
  if (!isObject(dto)) {
    return undefined;
  }

  if (hasLength(parsed.paramsFilter)) {
    for (const filter of parsed.paramsFilter) {
      dto[filter.field] = filter.value;
    }
  }

  if (!hasLength(objKeys(dto))) {
    return undefined;
  }

  return dto instanceof this.entityType
    ? Object.assign(dto, parsed.authPersist)
    : plainToClass(
        this.entityType,
        { ...dto, ...parsed.authPersist },
        { ignoreDecorators: true },
      );
};
