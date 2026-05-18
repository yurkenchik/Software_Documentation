import { Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

@Injectable()
export class RedisClientFactory implements OnModuleDestroy {
    private readonly logger = new Logger(RedisClientFactory.name);
    private client: Redis | null = null;

    constructor(private readonly configService: ConfigService) {}

    getClient(): Redis {
        if (this.client) {
            return this.client;
        }

        const host = this.configService.get<string>('REDIS_HOST') ?? 'localhost';
        const port = this.configService.get<number>('REDIS_PORT') ?? 6379;
        const password = this.configService.get<string>('REDIS_PASSWORD');

        this.client = new Redis({ host, port, password, lazyConnect: true });
        this.logger.debug({ host, port }, 'Redis client initialized');

        return this.client;
    }

    async onModuleDestroy(): Promise<void> {
        if (this.client) {
            await this.client.quit();
            this.client = null;
        }
    }
}
