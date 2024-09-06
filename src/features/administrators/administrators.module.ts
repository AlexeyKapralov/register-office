import { Module } from '@nestjs/common';
import { AdministratorsController } from './api/administrators.controller';
import { AdministratorsService } from './application/administrators.service';
import { AdministratorsRepository } from './infrastructure/administrators.repository';
import { CryptoService } from '../../base/services/crypto-service';
import { UsersModule } from '../users/user.module';
import { DoctorsModule } from '../doctors/doctors.module';

@Module({
    imports: [UsersModule, DoctorsModule],
    controllers: [AdministratorsController],
    providers: [AdministratorsService, AdministratorsRepository, CryptoService],
    exports: [AdministratorsService],
})
export class AdministratorsModule {}
