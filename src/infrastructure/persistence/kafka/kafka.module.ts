import { Module } from '@nestjs/common';
import { KafkaClientFactory } from '@infrastructure/persistence/kafka/factories/kafka-client.factory';

@Module({
    providers: [KafkaClientFactory],
    exports: [KafkaClientFactory],
})
export class KafkaModule {}
