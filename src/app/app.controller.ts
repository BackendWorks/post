import { Controller, Get } from '@nestjs/common';
import { Public } from '../core/decorators/public.decorator';
import { HealthCheck, HealthCheckService } from '@nestjs/terminus';
import { PrismaService } from '../common/services/prisma.service';

@Controller()
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
