import { ApiPropertyOptional } from '@nestjs/swagger';
import {
    IsDate,
    IsEmail,
    IsOptional,
    IsStrongPassword,
    Length,
} from 'class-validator';
import { Transform, TransformFnParams } from 'class-transformer';
import { Trim } from '../../../../../common/decorators/transform/trim.decorator';

export class DoctorInputUpdateDto {
    @ApiPropertyOptional({
        example: 'Alexey',
    })
    @IsOptional()
    @Trim()
    @Length(2, 100)
    firstName: string = null;

    @ApiPropertyOptional({
        example: 'Petrov',
    })
    @IsOptional()
    @Trim()
    @Length(2, 100)
    lastName: string = null;

    @ApiPropertyOptional({
        example: 'email@mail.com',
    })
    @IsOptional()
    @Trim()
    @Length(2)
    @IsEmail()
    email: string = null;

    @ApiPropertyOptional({
        example: 'login123',
    })
    @IsOptional()
    @Trim()
    @Length(6, 50)
    login: string = null;

    @ApiPropertyOptional({
        example: 'Quytaxmu@21',
    })
    @IsOptional()
    @Trim()
    @IsStrongPassword()
    password: string = null;

    @ApiPropertyOptional()
    @IsOptional()
    @Trim()
    @Length(1, 250)
    region: string = null;

    @ApiPropertyOptional()
    @IsOptional()
    @Trim()
    @Length(1, 100)
    city: string = null;

    @ApiPropertyOptional({
        example: '+7-909-214-12-09',
    })
    @IsOptional()
    @Trim()
    @Length(1, 20)
    phoneNumber: string = null;

    @ApiPropertyOptional({
        example: 'Terapy',
    })
    @IsOptional()
    @Trim()
    @Length(1, 20)
    specialization: string = null;

    @ApiPropertyOptional({
        example: '1988-09-04T08:30:26.525Z',
    })
    @IsOptional()
    @Transform(({ value }: TransformFnParams) => new Date(String(value)))
    @IsDate()
    dob: Date = null;
}
