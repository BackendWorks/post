import { Injectable, OnModuleInit, Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientGrpc } from '@nestjs/microservices';
import { ValidateTokenRequest, ValidateTokenResponse } from '../../generated/auth';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class GrpcAuthService implements OnModuleInit {
    private authService: any;

    constructor(
        private readonly configService: ConfigService,
        @Inject('AUTH_PACKAGE') private readonly client: ClientGrpc,
    ) {}

    onModuleInit() {
        this.authService = this.client.getService('AuthService');
    }

    async validateToken(token: string): Promise<ValidateTokenResponse> {
        const request: ValidateTokenRequest = { token };
        return firstValueFrom(this.authService.validateToken(request));
    }

    async getUserById(userId: string): Promise<any> {
        const request = { id: userId };
        return firstValueFrom(this.authService.getUserById(request));
    }

    async getUserByEmail(email: string): Promise<any> {
        const request = { email };
        return firstValueFrom(this.authService.getUserByEmail(request));
    }
}
