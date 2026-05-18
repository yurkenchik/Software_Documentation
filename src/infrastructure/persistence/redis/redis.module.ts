import { Module } from '@nestjs/common';
import { RedisClientFactory } from '@infrastructure/persistence/redis/factories/redis-client.factory';

@Module({
    providers: [RedisClientFactory],
    exports: [RedisClientFactory],
})
export class RedisModule {}
