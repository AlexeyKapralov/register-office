import { Module } from '@nestjs/common';
import { DoctorsController } from './api/doctors.controller';

@Module({
    controllers: [DoctorsController],
})
export class DoctorsModule {}
