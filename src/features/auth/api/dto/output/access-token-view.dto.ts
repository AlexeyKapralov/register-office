import { ApiProperty } from '@nestjs/swagger';

export class AccessTokenViewDto {
    @ApiProperty()
    accessToken: string;
}
