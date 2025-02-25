import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';

import { KafkaAuthService } from './kafka.auth.service';

import { SERVICES } from '@/common/enums/app.enum';

@Module({
    imports: [
        ClientsModule.registerAsync([
            {
                name: SERVICES.AUTH,
                imports: [ConfigModule],
                useFactory: (configService: ConfigService) => ({
                    transport: Transport.KAFKA,
                    options: {
                        client: {
                            clientId: configService.get('kafka.clientId'),
                            brokers: configService.get('kafka.brokers'),
                        },
                        consumer: {
                            groupId: configService.get(
                                'kafka.consumer.groupId',
                            ),
                            allowAutoTopicCreation: true,
                        },
                        producer: {
                            allowAutoTopicCreation: true,
                        },
                    },
                }),
                inject: [ConfigService],
            },
        ]),
    ],
    providers: [KafkaAuthService],
    exports: [KafkaAuthService],
})
export class KafkaAuthModule {}
