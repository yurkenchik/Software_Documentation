import { Injectable, OnModuleDestroy } from '@nestjs/common';
import type { IRowOutputStrategy } from '@domain/statement-import/ports/row-output-strategy.port';
import { ConfigService } from '@nestjs/config';
import { KafkaClientFactory } from '@infrastructure/persistence/kafka/factories/kafka-client.factory';

@Injectable()
export class KafkaRowOutputStrategy implements IRowOutputStrategy, OnModuleDestroy {
    private readonly topic: string;

    constructor(
        private readonly configService: ConfigService,
        private readonly kafkaClientFactory: KafkaClientFactory,
    ) {
        this.topic = this.configService.get<string>('KAFKA_TOPIC') ?? 'csv-rows';
    }

    async onModuleDestroy(): Promise<void> {
        const producer = this.kafkaClientFactory.getProducer();
        await producer.disconnect();
    }

    async write(row: Array<string>): Promise<void> {
        const producer = this.kafkaClientFactory.getProducer();
        await producer.connect();
        await producer.send({
            topic: this.topic,
            messages: [{ value: JSON.stringify(row) }],
        });
    }

    async flush(): Promise<void> {}
}
