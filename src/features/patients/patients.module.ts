import { Module } from '@nestjs/common';
import { PatientsController } from './api/patients.controller';

@Module({
    controllers: [PatientsController],
})
export class PatientsModule {}
