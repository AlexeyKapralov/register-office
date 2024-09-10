import { ApiProperty } from '@nestjs/swagger';
import { IsDate } from 'class-validator';
import { Transform, TransformFnParams } from 'class-transformer';
import dayjs from 'dayjs';

export class SchedulePeriodInputDto {
    @ApiProperty({ example: '2024-09-04T08:00:00.000Z' })
    @Transform(({ value }: TransformFnParams) => new Date(String(value)))
    @IsDate()
    startDate: Date;

    @ApiProperty({ example: '2024-09-04T18:30:00.000Z' })
    @Transform(({ value }: TransformFnParams) => new Date(String(value)))
    @IsDate()
    finishDate: Date;
}
