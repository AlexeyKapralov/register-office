import { ApiProperty } from '@nestjs/swagger';
import { IsDate } from 'class-validator';
import { Transform, TransformFnParams } from 'class-transformer';

export class DeleteScheduleInputDto {
    @ApiProperty({ example: '2024-09-04T05:40:55.083Z' })
    @Transform(({ value }: TransformFnParams) => new Date(String(value)))
    @IsDate()
    workDate: Date;
}
