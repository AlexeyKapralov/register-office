import { Module } from '@nestjs/common';
import { DoctorsController } from './api/doctors.controller';
import { DoctorsRepository } from './infrastructure/doctors.repository';
import { DoctorsService } from './application/doctors.service';
import { JwtStrategy } from '../auth/strategies/jwt.strategy';
import { AppointmentsModule } from '../appointments/appointments.module';

@Module({
    imports: [AppointmentsModule],
    controllers: [DoctorsController],
    providers: [DoctorsRepository, DoctorsService, JwtStrategy],
    exports: [DoctorsService],
})
export class DoctorsModule {}
