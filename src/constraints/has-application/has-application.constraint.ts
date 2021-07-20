import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import type { JoinApplicationsService } from 'src/join-applications/join-applications.service';
import { ValidationArguments } from '../validation-arguments.interface';
import { HasApplicationConstraintArguments } from './has-application-constraint-arguments.type';

@ValidatorConstraint({ async: true })
@Injectable()
export class HasApplicationConstraint
  implements ValidatorConstraintInterface, OnModuleInit {
  @Inject()
  moduleRef: ModuleRef;

  applicationsService: JoinApplicationsService;

  async onModuleInit() {
    this.applicationsService = this.moduleRef.get(
      (await import('src/join-applications/join-applications.service'))
        .JoinApplicationsService,
      { strict: false },
    );
  }

  async validate(
    classroomId: number,
    {
      object: {
        _context: { user },
      },
      constraints: [status],
    }: ValidationArguments<HasApplicationConstraintArguments>,
  ) {
    try {
      await this.applicationsService.retrieve({
        conditions: {
          owner: user,
          classroom: classroomId,
          status,
        },
        user,
      });
      return true;
    } catch {
      return false;
    }
  }

  defaultMessage({
    constraints: [status],
  }: ValidationArguments<HasApplicationConstraintArguments>) {
    return `The classroom must have an ${status} application sent by you`;
  }
}
