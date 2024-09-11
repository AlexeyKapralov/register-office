import { Module } from '@nestjs/common';
import { AppointmentsRepository } from './repository/appointments.repository';
import { AppointmentsService } from './application/appointments.service';
import { DoctorsModule } from '../doctors/doctors.module';

@Module({
    imports: [],
    providers: [AppointmentsRepository, AppointmentsService],
    exports: [AppointmentsService],
})
export class AppointmentsModule {}
