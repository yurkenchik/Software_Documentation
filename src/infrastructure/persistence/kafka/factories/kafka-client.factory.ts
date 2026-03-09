import {
    Injectable,
    Logger,
    InternalServerErrorException,
    OnModuleDestroy,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Kafka, Partitioners, type Producer } from 'kafkajs';

@Injectable()
export class KafkaClientFactory implements OnModuleDestroy {
    private readonly logger = new Logger(KafkaClientFactory.name);

    private kafka: Kafka | null = null;
    private producerInstance: Producer | null = null;

    constructor(private readonly configService: ConfigService) {}

    getClient(): Kafka {
        if (this.kafka) {
            return this.kafka;
        }

        try {
            const brokers = this.configService.get<string>('KAFKA_BROKERS') ?? 'localhost:9092';
            const clientId =
                this.configService.get<string>('KAFKA_CLIENT_ID') ?? 'site-constructor';

            this.kafka = new Kafka({
                clientId,
                brokers: brokers.split(',').map((b) => b.trim()),
            });

            this.logger.debug(
                { brokers: brokers.split(',').map((b) => b.trim()), clientId },
                'Kafka client initialized',
            );
            return this.kafka;
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : String(error);
            this.logger.error({ errorMessage: message }, 'Failed to initialize Kafka client');
            throw new InternalServerErrorException(
                `Failed to initialize Kafka client. Set KAFKA_BROKERS (optional: KAFKA_CLIENT_ID). Original: ${message}`,
            );
        }
    }

    getProducer(): Producer {
        if (this.producerInstance) {
            return this.producerInstance;
        }

        try {
            this.producerInstance = this.getClient().producer({
                createPartitioner: Partitioners.LegacyPartitioner,
            });
            this.logger.debug('Kafka producer created');
            return this.producerInstance;
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : String(error);
            this.logger.error({ errorMessage: message }, 'Failed to create Kafka producer');
            throw new InternalServerErrorException(
                `Failed to create Kafka producer. Original: ${message}`,
            );
        }
    }

    async onModuleDestroy(): Promise<void> {
        if (this.producerInstance) {
            await this.producerInstance.disconnect();
            this.producerInstance = null;
        }
        this.kafka = null;
    }
}
