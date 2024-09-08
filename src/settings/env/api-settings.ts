import { EnvironmentVariable } from './env-settings';
import { IsString, Matches } from 'class-validator';

export class ApiSettings {
    constructor(private environmentVariable: EnvironmentVariable) {}

    @IsString()
    PORT = this.environmentVariable.PORT;
    @Matches('\\d+(?: days|m|s)')
    ACCESS_TOKEN_EXPIRATION_LIVE =
        this.environmentVariable.ACCESS_TOKEN_EXPIRATION_LIVE;
    @Matches('\\d+(?: days|m|s)')
    REFRESH_TOKEN_EXPIRATION_LIVE =
        this.environmentVariable.REFRESH_TOKEN_EXPIRATION_LIVE;
    @IsString()
    SECRET = this.environmentVariable.SECRET;
}
