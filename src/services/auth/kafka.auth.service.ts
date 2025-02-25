import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

import { SERVICES } from '@/common/enums/app.enum';
import { IAuthPayload } from '@/common/interfaces/request.interface';
import { IUser } from '@/common/interfaces/user.interface';

@Injectable()
export class KafkaAuthService implements OnModuleInit {
    private readonly logger = new Logger(KafkaAuthService.name);

    constructor(@Inject(SERVICES.AUTH) private readonly client: ClientKafka) {}

    async onModuleInit() {
        this.client.subscribeToResponseOf('auth.token.validate');
        this.client.subscribeToResponseOf('auth.user.get');
        await this.client.connect();
        this.logger.log('Connected to Kafka');
    }

    async validateToken(token: string): Promise<IAuthPayload> {
        this.logger.debug(`Sending token validation request: ${token}`);
        try {
            const response = await firstValueFrom(
                this.client.send('auth.token.validate', token),
            );
            if (!response.success) throw new Error(response.error);
            this.logger.debug('Received validation response', response);
            return response.payload;
        } catch (error) {
            this.logger.error(`Token validation failed: ${error.message}`);
            throw error;
        }
    }

    async getUserById(userId: string): Promise<IUser> {
        this.logger.debug(`Fetching user details for ID: ${userId}`);
        try {
            const response = await firstValueFrom(
                this.client.send('auth.user.get', userId),
            );
            if (!response.success) throw new Error(response.error);
            this.logger.debug('User details fetched successfully', response);
            return response.payload;
        } catch (error) {
            this.logger.error(`Failed to fetch user details: ${error.message}`);
            throw error;
        }
    }
}
