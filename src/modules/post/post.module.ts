import { Module } from '@nestjs/common';

import { PostController } from './controllers/post.controller';
import { PostService } from './services/post.service';
import { PostMappingService } from './services/post-mapping.service';

import { DatabaseModule } from '@/database/database.module';
import { KafkaAuthModule } from '@/services/auth/kafka.auth.module';

@Module({
    imports: [DatabaseModule, KafkaAuthModule],
    controllers: [PostController],
    providers: [PostService, PostMappingService],
    exports: [PostService, PostMappingService],
})
export class PostModule {}
