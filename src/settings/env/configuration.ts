import { ValidateNested, validateSync } from 'class-validator';
import { ApiSettings } from './api-settings';
import { EnvironmentSettings, EnvironmentVariable } from './env-settings';
import * as process from 'node:process';

export type ConfigurationType = Configuration;

export class Configuration {
    @ValidateNested() //не игнорировать вложенную валидацию
    apiSettings: ApiSettings;
    @ValidateNested()
    environmentSettings: EnvironmentSettings;

    private constructor(configuration: Configuration) {
        Object.assign(this, configuration);
    }

    static createConfig(
        environmentVariables: Record<string, string>,
    ): Configuration {
        return new this({
            apiSettings: new ApiSettings(environmentVariables),
            environmentSettings: new EnvironmentSettings(environmentVariables),
        });
    }
}

export function validate(environmentVariable: Record<string, string>) {
    const config = Configuration.createConfig(environmentVariable);
    const errors = validateSync(config, { skipMissingProperties: false });
    if (errors.length > 0) {
        throw new Error(errors.toString());
    }
    return config;
}

export default () => {
    const environmentVariables = process.env as EnvironmentVariable;
    return Configuration.createConfig(environmentVariables);
};
