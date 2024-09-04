import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsEmail, IsNumber, IsStrongPassword } from 'class-validator';
import { Transform, TransformFnParams } from 'class-transformer';

export class DoctorInputDto {
    @ApiProperty({
        example: 'Alexey',
    })
    firstName: string;
    @ApiProperty({
        example: 'Petrov',
    })
    lastName: string;
    @ApiProperty({
        example: 'email@mail.com',
    })
    @IsEmail()
    email: string;
    @ApiProperty({
        example: 'login123',
    })
    login: string;
    @ApiProperty({
        example: 'Quytaxmu@21',
    })
    @IsStrongPassword()
    password: string;
    @ApiProperty()
    region: string;
    @ApiProperty()
    city: string;
    @ApiProperty({
        example: '+7-909-214-12-09',
    })
    phoneNumber: string;
    @ApiProperty({
        example: 'Terapy',
    })
    specialization: string;
    @ApiProperty({
        example: '1988-09-04T08:30:26.525Z',
    })
    @Transform(({ value }: TransformFnParams) => new Date(String(value)))
    @IsDate()
    dob: Date;
}
