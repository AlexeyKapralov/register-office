import { Module } from '@nestjs/common';
import { DoctorsController } from './api/doctors.controller';
import { DoctorsRepository } from './infrastructure/doctors.repository';
import { DoctorsService } from './application/doctors.service';

@Module({
    controllers: [DoctorsController],
    providers: [DoctorsRepository, DoctorsService],
    exports: [DoctorsService],
})
export class DoctorsModule {}
