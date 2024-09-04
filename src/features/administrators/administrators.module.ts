import { Module } from '@nestjs/common';
import { AdministratorsController } from './api/administrators.controller';

@Module({
    controllers: [AdministratorsController],
})
export class AdministratorsModule {}
