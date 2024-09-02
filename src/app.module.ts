import { Global, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LoggerModule } from 'nestjs-pino';
import { ConfigModule } from '@nestjs/config';
import configuration, { validate } from './settings/env/configuration';

@Global()
@Module({
    imports: [
        LoggerModule.forRoot({
            pinoHttp: {
                transport: {
                    target: 'pino-pretty',
                },
            },
        }),
        ConfigModule.forRoot({
            isGlobal: true,
            load: [configuration],
            validate: validate,
            ignoreEnvFile: false, //для development
            envFilePath: ['.env'],
        }),
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
