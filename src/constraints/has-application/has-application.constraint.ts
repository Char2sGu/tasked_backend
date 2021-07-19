import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { BodyContextAttached } from 'src/body-context/body-context-attached.interface';
import { ApplicationStatus } from 'src/join-applications/application-status.enum';
import type { JoinApplicationsService } from 'src/join-applications/join-applications.service';

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
    validationArguments: ValidationArguments & { object: BodyContextAttached },
  ) {
    const { user } = validationArguments.object._context;
    const status = this.getStatus(validationArguments);
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

  defaultMessage(validationArguments: ValidationArguments) {
    const status = this.getStatus(validationArguments);
    return `The classroom must have an ${status} application sent by you`;
  }

  getStatus({ constraints }: ValidationArguments) {
    const [status] = constraints as [ApplicationStatus | undefined];
    return status;
  }
}
