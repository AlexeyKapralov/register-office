import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsEmail, IsStrongPassword, Length } from 'class-validator';
import { Transform, TransformFnParams } from 'class-transformer';
import { Trim } from '../../../../../common/decorators/transform/trim.decorator';

export class DoctorInputDto {
    @ApiProperty({
        example: 'Alexey',
    })
    @Trim()
    @Length(2, 100)
    firstName: string;

    @ApiProperty({
        example: 'Petrov',
    })
    @Trim()
    @Length(2, 100)
    lastName: string;

    @ApiProperty({
        example: 'email@mail.com',
    })
    @Trim()
    @Length(2)
    @IsEmail()
    email: string;

    @ApiProperty({
        example: 'login123',
    })
    @Trim()
    @Length(6, 50)
    login: string;

    @ApiProperty({
        example: 'Quytaxmu@21',
    })
    @Trim()
    @IsStrongPassword()
    password: string;

    @ApiProperty()
    @Trim()
    @Length(1, 250)
    region: string;

    @ApiProperty()
    @Trim()
    @Length(1, 100)
    city: string;

    @ApiProperty({
        example: '+7-909-214-12-09',
    })
    @Trim()
    @Length(1, 20)
    phoneNumber: string;

    @ApiProperty({
        example: 'Terapy',
    })
    @Trim()
    @Length(1, 20)
    specialization: string;

    @ApiProperty({
        example: '1988-09-04T08:30:26.525Z',
    })
    @Transform(({ value }: TransformFnParams) => new Date(String(value)))
    @IsDate()
    dob: Date;
}
