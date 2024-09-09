import { Module } from '@nestjs/common';
import { AuthController } from './api/auth.controller';
import { AuthService } from './application/auth.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { ConfigurationType } from '../../settings/env/configuration';
import { ApiSettings } from '../../settings/env/api-settings';
import { CryptoService } from '../../base/services/crypto-service';
import { UsersModule } from '../users/user.module';
import { AuthRepository } from './repository/auth.repository';

@Module({
    imports: [
        UsersModule,
        JwtModule.registerAsync({
            useFactory: (configService: ConfigService<ConfigurationType>) => {
                const apiSettings = configService.get<ApiSettings>(
                    'apiSettings',
                    { infer: true },
                );
                return {
                    secret: apiSettings.SECRET,
                };
            },
            global: true,
            inject: [ConfigService],
        }),
    ],
    controllers: [AuthController],
    providers: [AuthService, AuthRepository, CryptoService],
    exports: [AuthService],
})
export class AuthModule {}
