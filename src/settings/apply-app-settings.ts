import { NestExpressApplication } from '@nestjs/platform-express';
import { useContainer } from 'class-validator';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from '../common/exception-filters/http-exception-filter';
import { AppModule } from '../app.module';
import cookieParser from 'cookie-parser';
import { Logger } from 'nestjs-pino';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export const applyAppSettings = (app: NestExpressApplication) => {
    app.enableCors();
    app.set('trust proxy', true);
    app.useLogger(app.get(Logger));

    const config = new DocumentBuilder()
        .setTitle('Register office')
        .setDescription('The register office API description')
        .setVersion('1.0')
        .addTag('Register office')
        .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);

    // Для внедрения зависимостей в validator constraint
    // {fallbackOnErrors: true} требуется, поскольку Nest генерирует исключение,
    // когда DI не имеет необходимого класса.
    useContainer(app.select(AppModule), { fallbackOnErrors: true });

    app.use(cookieParser());

    app.useGlobalPipes(
        new ValidationPipe({
            transform: true,
            stopAtFirstError: true, //не работает с асинхронными декораторами
            exceptionFactory: (errors) => {
                const errorsForResponse = [];

                errors.forEach((e) => {
                    const constrainsKeys = Object.keys(e.constraints);
                    constrainsKeys.forEach((ckey) => {
                        errorsForResponse.push({
                            message: e.constraints[ckey],
                            field: e.property,
                        });
                    });
                });

                throw new BadRequestException(errorsForResponse);
            },
        }),
    );
    app.useGlobalFilters(new HttpExceptionFilter());
};
