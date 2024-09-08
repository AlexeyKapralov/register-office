import {
    Body,
    Controller,
    HttpCode,
    HttpStatus,
    Post,
    Res,
    UnauthorizedException,
} from '@nestjs/common';
import { LoginInputDto } from './dto/input/login-input.dto';
import {
    ApiBearerAuth,
    ApiCreatedResponse,
    ApiOperation,
    ApiTags,
    ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AccessTokenViewDto } from './dto/output/access-token-view.dto';
import { AuthService } from '../application/auth.service';
import { Response } from 'express';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @ApiOperation({ summary: 'Login' })
    @ApiBearerAuth('Authorization Token')
    @Post('login')
    @ApiCreatedResponse({
        description: 'Access token',
        type: AccessTokenViewDto,
    })
    @ApiUnauthorizedResponse({
        description: 'Unauthorized',
    })
    @HttpCode(HttpStatus.OK)
    async login(
        @Body() loginInputDto: LoginInputDto,
        @Res({ passthrough: true }) response: Response,
    ): Promise<{ accessToken: string }> {
        const interlayerTokens = await this.authService.login(loginInputDto);
        if (interlayerTokens.hasError()) {
            throw new UnauthorizedException();
        }

        response.cookie('refreshToken', interlayerTokens.data.refreshToken, {
            secure: true,
            httpOnly: true,
        });
        return {
            accessToken: interlayerTokens.data.accessToken,
        };
    }
}
