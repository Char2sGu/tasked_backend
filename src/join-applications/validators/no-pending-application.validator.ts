import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { BodyContextAttached } from 'src/body-context-attached.interface';
import { ApplicationStatus } from '../application-status.enum';
import type { JoinApplicationsService } from '../join-applications.service';

@ValidatorConstraint({ async: true })
@Injectable()
export class NoPendingApplicaiton
  implements ValidatorConstraintInterface, OnModuleInit {
  @Inject()
  moduleRef: ModuleRef;

  applicationsService: JoinApplicationsService;

  async onModuleInit() {
    // require lazy load due to circular import
    this.applicationsService = this.moduleRef.get(
      (await import('../join-applications.service')).JoinApplicationsService,
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
