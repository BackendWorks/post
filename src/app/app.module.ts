import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { CommonModule } from 'src/common/common.module';
import { DatabaseModule } from 'src/database/database.module';

import { PostModule } from '../modules/post/post.module';
import { AppController } from './app.controller';

@Module({
    imports: [CommonModule, DatabaseModule, PostModule, TerminusModule],
    controllers: [AppController],
})
export class AppModule {}
