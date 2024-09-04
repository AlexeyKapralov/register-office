import { Global, Module } from '@nestjs/common';
import { LoggerModule } from 'nestjs-pino';
import { ConfigModule } from '@nestjs/config';
import configuration, { validate } from './settings/env/configuration';
import { PatientsModule } from './features/patients/patients.module';
import { DoctorsModule } from './features/doctors/doctors.module';
import { AdministratorsModule } from './features/administrators/administrators.module';

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
        PatientsModule,
        DoctorsModule,
        AdministratorsModule,
        ConfigModule.forRoot({
            isGlobal: true,
            load: [configuration],
            validate: validate,
            ignoreEnvFile: false, //для development
            envFilePath: ['.env'],
        }),
    ],
})
export class AppModule {}
