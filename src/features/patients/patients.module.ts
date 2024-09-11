import { Module } from '@nestjs/common';
import { PatientsController } from './api/patients.controller';
import { PatientsRepository } from './infrastructure/patients.repository';
import { PatientsService } from './application/patients.service';
import { DoctorsModule } from '../doctors/doctors.module';
import { AppointmentsModule } from '../appointments/appointments.module';

@Module({
    imports: [DoctorsModule, AppointmentsModule],
    controllers: [PatientsController],
    providers: [PatientsRepository, PatientsService],
})
export class PatientsModule {}
