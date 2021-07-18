import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { BodyContextAttached } from 'src/body-context/body-context-attached.interface';
import { ApplicationStatus } from '../../join-applications/application-status.enum';
import type { JoinApplicationsService } from '../../join-applications/join-applications.service';

@ValidatorConstraint({ async: true })
@Injectable()
export class NoPendingApplicaitonConstraint
  implements ValidatorConstraintInterface, OnModuleInit {
  @Inject()
  moduleRef: ModuleRef;

  applicationsService: JoinApplicationsService;

  async onModuleInit() {
    // exists circular import
    this.applicationsService = this.moduleRef.get(
      (await import('../../join-applications/join-applications.service'))
        .JoinApplicationsService,
      { strict: false }, // don't known why it only works when `strict` is `false`
    );
  }

  async validate(
    classroomId: number,
    {
      object: {
        _context: { user },
      },
    }: ValidationArguments & { object: BodyContextAttached },
  ) {
    try {
      await this.applicationsService.retrieve({
        conditions: {
          owner: user,
          classroom: classroomId,
          status: ApplicationStatus.Pending,
        },
        user,
      });
      return false;
    } catch {
      return true;
    }
  }

  defaultMessage() {
    return 'A pending application already exists in this classroom';
  }
}
