import { EnvironmentVariable } from './env-settings';
import { IsString, Matches } from 'class-validator';

export class ApiSettings {
    constructor(private environmentVariable: EnvironmentVariable) {}

    @IsString()
    PORT = this.environmentVariable.PORT;
}
