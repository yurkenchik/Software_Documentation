import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { DomainExceptionFilter } from '@presentation/filters/domain-exception.filter';
import { Logger } from '@nestjs/common';

async function bootstrap() {
    const nestApplication = await NestFactory.create(AppModule);

    nestApplication.useGlobalFilters(new DomainExceptionFilter());
    nestApplication.setGlobalPrefix('api');

    const configService = nestApplication.get(ConfigService);
    const logger = new Logger('ApplicationLauncher');

    const port = configService.get<number>('PORT') ?? 3000;
    await nestApplication.listen(port, () => {
        logger.log({ port }, `Server is running on port`);
    });
}
void bootstrap();
