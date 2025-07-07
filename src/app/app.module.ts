import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { CommonModule } from 'src/common/common.module';
import { DatabaseService } from 'src/common/services/database.service';
import { GrpcAuthModule } from '../services/auth/grpc.auth.module';

import { PostModule } from '../modules/post/post.module';
import { AppController } from './app.controller';

@Module({
    imports: [CommonModule, GrpcAuthModule, PostModule, TerminusModule],
    controllers: [AppController],
    providers: [DatabaseService],
})
export class AppModule {}
