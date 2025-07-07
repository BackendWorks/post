import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { GrpcAuthService } from './grpc.auth.service';

@Module({
    imports: [
        ClientsModule.registerAsync([
            {
                name: 'AUTH_PACKAGE',
                imports: [ConfigModule],
                useFactory: (configService: ConfigService) => ({
                    transport: Transport.GRPC,
                    options: {
                        package: 'auth',
                        protoPath: join(__dirname, '../../protos/auth.proto'),
                        url: configService.get<string>('grpc.authUrl'),
                    },
                }),
                inject: [ConfigService],
            },
        ]),
    ],
    providers: [GrpcAuthService],
    exports: [GrpcAuthService],
})
export class GrpcAuthModule {}
