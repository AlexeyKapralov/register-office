import { Injectable } from '@nestjs/common';
import { CryptoService } from '../../../base/services/crypto-service';
import { LoginInputDto } from '../api/dto/input/login-input.dto';
import { InterlayerNotice } from '../../../base/models/interlayer';
import { UsersService } from '../../users/application/users.service';
import { TokensDto } from '../../../base/models/tokensDto';
import { UsersModel } from '../../../database/models/users.model';
import { ConfigService } from '@nestjs/config';
import { ApiSettings } from '../../../settings/env/api-settings';
import { JwtService } from '@nestjs/jwt';
import { AuthRepository } from '../repository/auth.repository';

@Injectable()
export class AuthService {
    constructor(
        private readonly cryptoService: CryptoService,
        private readonly usersService: UsersService,
        private readonly authRepository: AuthRepository,
        private readonly configService: ConfigService,
        private readonly jwtService: JwtService,
    ) {}

    async login(
        loginInputDto: LoginInputDto,
    ): Promise<InterlayerNotice<TokensDto>> {
        const notice = new InterlayerNotice<TokensDto>();

        let user: UsersModel;
        const userByLoginInterlayer = await this.authRepository.getUserByLogin(
            loginInputDto.loginOrEmail,
        );
        const userByEmailInterlayer = await this.authRepository.getUserByEmail(
            loginInputDto.loginOrEmail,
        );
        if (!userByLoginInterlayer && !userByEmailInterlayer) {
            notice.addError('user was not found');
            return notice;
        }
        userByLoginInterlayer
            ? (user = userByLoginInterlayer)
            : (user = userByEmailInterlayer);

        const isPasswordValid = await this.cryptoService.comparePasswordHash(
            loginInputDto.password,
            user.password,
        );
        if (!isPasswordValid) {
            notice.addError('password is not valid');
            return notice;
        }

        const roleInterlayer = await this.usersService.getUserRole(user.roleId);

        if (roleInterlayer.hasError()) {
            notice.addError(roleInterlayer.extensions[0].message);
            return notice;
        }

        const tokens = await this.updateDevicesAndCreateTokens(
            user.id,
            roleInterlayer.data,
        );

        notice.addData({
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken,
        });

        return notice;
    }

    async updateDevicesAndCreateTokens(
        userId: string = undefined,
        role: string,
    ): Promise<TokensDto | null> {
        const apiSettings = this.configService.get<ApiSettings>('apiSettings', {
            infer: true,
        });
        let accessTokenExpLive = apiSettings.ACCESS_TOKEN_EXPIRATION_LIVE;
        // accessTokenExpLive = Number(ms(accessTokenExpLive)) / 1000;

        let refreshTokenExpLive = apiSettings.REFRESH_TOKEN_EXPIRATION_LIVE;
        // refreshTokenExpLive = Number(ms(refreshTokenExpLive)) / 1000;

        const accessToken = this.jwtService.sign(
            {
                userId: userId,
                role: role,
            },
            { expiresIn: accessTokenExpLive },
        );
        const refreshToken = this.jwtService.sign(
            {
                userId: userId,
                role: role,
            },
            {
                expiresIn: refreshTokenExpLive,
            },
        );

        return {
            accessToken,
            refreshToken,
        };
    }
}
