import { IsString, IsStrongPassword, Length, Matches } from 'class-validator';
import { Trim } from '../../../../../common/decorators/transform/trim.decorator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginInputDto {
    @ApiProperty({
        example: 'login123',
    })
    @IsString()
    @Trim()
    loginOrEmail: string;

    @ApiProperty({
        example: '123456@',
    })
    @IsString()
    @Trim()
    password: string;
}
