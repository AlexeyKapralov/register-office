import { Global, Module } from '@nestjs/common';
import { LoggerModule } from 'nestjs-pino';
import { ConfigModule } from '@nestjs/config';
import configuration, { validate } from './settings/env/configuration';
import { PatientsModule } from './features/patients/patients.module';
import { DoctorsModule } from './features/doctors/doctors.module';
import { AdministratorsModule } from './features/administrators/administrators.module';
import { DatabaseModule } from './database/database.module';
import { UsersModule } from './features/users/user.module';
import { AuthModule } from './features/auth/auth.module';
import { PassportModule } from '@nestjs/passport';
import { AppointmentsModule } from './features/appointments/appointments.module';

@Global()
@Module({
    imports: [
        PassportModule,
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
        AppointmentsModule,
        UsersModule,
        AuthModule,
        DatabaseModule,
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
