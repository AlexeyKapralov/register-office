import { Module } from '@nestjs/common';
import { UsersRepository } from './infrastructure/users.repository';
import { UsersService } from './application/users.service';
import { CryptoService } from '../../base/services/crypto-service';

@Module({
    imports: [CryptoService],
    providers: [UsersRepository, UsersService],
    exports: [UsersService],
})
export class UsersModule {}
