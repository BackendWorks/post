import { Controller, Get, VERSION_NEUTRAL } from '@nestjs/common';
import { HealthCheck, HealthCheckService } from '@nestjs/terminus';

import { Public } from '../decorators/public.decorator';
import { PrismaService } from '../common/services/prisma.service';

@Controller({
  version: VERSION_NEUTRAL,
  path: '/',
})
export class AppController {
  constructor(
    private healthCheckService: HealthCheckService,
    private prismaService: PrismaService,
  ) {}

  @Get('/health')
  @HealthCheck()
  @Public()
  public async getHealth() {
    return this.healthCheckService.check([
      () => this.prismaService.isHealthy(),
    ]);
  }
}
