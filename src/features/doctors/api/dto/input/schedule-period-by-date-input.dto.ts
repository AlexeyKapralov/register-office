import { ApiProperty } from '@nestjs/swagger';
import { IsDate } from 'class-validator';
import { Transform, TransformFnParams } from 'class-transformer';

export class SchedulePeriodByDateInputDto {
    @ApiProperty({ example: '2024-09-04T05:40:55.083Z' })
    @Transform(({ value }: TransformFnParams) => new Date(String(value)))
    @IsDate()
    workDate: Date;

    @ApiProperty({ example: '2024-09-04T08:00:00.000Z' })
    @Transform(({ value }: TransformFnParams) => new Date(String(value)))
    @IsDate()
    startDate: Date;

    @ApiProperty({ example: '2024-09-04T18:30:00.000Z' })
    @Transform(({ value }: TransformFnParams) => new Date(String(value)))
    @IsDate()
    finishDate: Date;
}
