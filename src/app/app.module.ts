import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { CommonModule } from 'src/common/common.module';
import { GrpcAuthModule } from '../services/auth/grpc.auth.module';

import { PostModule } from '../modules/post/post.module';
import { AppController } from './app.controller';

@Module({
    imports: [CommonModule, GrpcAuthModule, PostModule, TerminusModule],
    controllers: [AppController],
    providers: [],
})
export class AppModule {}
