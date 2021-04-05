import { Controller } from '@nestjs/common';

export const ROOT_PREFIX = 'api';

@Controller(ROOT_PREFIX)
export class AppController {}
