import { ApiProperty } from '@nestjs/swagger';
import { IsDate } from 'class-validator';

export class ScheduleDateInputDto {
    @ApiProperty()
    @IsDate()
    date: Date;
}
