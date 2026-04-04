import { Logger, RequestMethod } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'node:path';
import hbs from 'hbs';
import type { Request, Response } from 'express';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { DomainExceptionFilter } from '@presentation/filters/domain-exception.filter';

async function bootstrap() {
    const nestApplication = await NestFactory.create<NestExpressApplication>(AppModule);

    nestApplication.useGlobalFilters(new DomainExceptionFilter());
    nestApplication.setGlobalPrefix('api', {
        exclude: [
            { path: '/', method: RequestMethod.GET },
            { path: 'sites', method: RequestMethod.GET },
        ],
    });

    const viewsRoot = join(__dirname, 'presentation', 'http', 'views');
    nestApplication.setBaseViewsDir(viewsRoot);
    nestApplication.setViewEngine('hbs');
    hbs.registerPartials(join(viewsRoot, 'partials'));

    const expressApp = nestApplication.getHttpAdapter().getInstance();
    expressApp.get('/', (_req: Request, res: Response) => {
        res.render('home', {
            title: 'Site constructor',
            message: 'Handlebars is enabled. Add templates under presentation/http/views.',
        });
    });

    const configService = nestApplication.get(ConfigService);
    const logger = new Logger('ApplicationLauncher');

    const port = configService.get<number>('PORT') ?? 3000;
    await nestApplication.listen(port, () => {
        logger.log({ port }, `Server is running on port`);
    });
}
void bootstrap();
