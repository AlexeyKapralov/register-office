import { Module } from '@nestjs/common';
import { DoctorsController } from './api/doctors.controller';
import { DoctorsRepository } from './infrastructure/doctors.repository';
import { DoctorsService } from './application/doctors.service';
import { JwtStrategy } from '../auth/strategies/jwt.strategy';
import { UsersService } from '../users/application/users.service';

@Module({
    imports: [],
    controllers: [DoctorsController],
    providers: [DoctorsRepository, DoctorsService, JwtStrategy],
    exports: [DoctorsService],
})
export class DoctorsModule {}
