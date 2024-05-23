import { Controller, Get, VERSION_NEUTRAL } from '@nestjs/common';
import { Public } from '../decorators/public.decorator';
import { HealthCheck, HealthCheckService } from '@nestjs/terminus';
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
