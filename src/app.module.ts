import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from './config/config.module';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigService } from './config/config.service';
import { APP_GUARD } from '@nestjs/core';
import { ClientAuthGuard } from './core/guards/auth.guard';
import { PrismaService } from './core/services/prisma.service';

@Module({
  imports: [
    ConfigModule,
    ClientsModule.registerAsync([
      {
        name: 'AUTH_SERVICE',
        imports: [ConfigModule],
        useFactory: async (configService: ConfigService) => ({
          transport: Transport.RMQ,
          options: {
            urls: [`${configService.get('rb_url')}`],
            queue: `${configService.get('auth_queue')}`,
            queueOptions: {
              durable: false,
            },
          },
        }),
        inject: [ConfigService],
      },
      {
        name: 'MAIL_SERVICE',
        imports: [ConfigModule],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.RMQ,
          options: {
            urls: [`${configService.get('rb_url')}`],
            queue: `${configService.get('mailer_queue')}`,
            queueOptions: {
              durable: false,
            },
          },
        }),
        inject: [ConfigService],
      },
    ]),
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ClientAuthGuard,
    },
    AppService,
    PrismaService,
  ],
})
export class AppModule {}
