import { Module } from '@nestjs/common';
import { AdministratorsController } from './api/administrators.controller';
import { AdministratorsService } from './application/administrators.service';
import { AdministratorsRepository } from './infrastructure/administrators.repository';
import { CryptoService } from '../../base/services/crypto-service';

@Module({
    controllers: [AdministratorsController],
    providers: [AdministratorsService, AdministratorsRepository, CryptoService],
})
export class AdministratorsModule {}
