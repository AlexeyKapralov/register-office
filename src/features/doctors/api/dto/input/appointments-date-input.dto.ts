import { ApiProperty } from '@nestjs/swagger';
import { IsDate } from 'class-validator';
import { Transform, TransformFnParams } from 'class-transformer';

export class AppointmentsDateInputDto {
    @ApiProperty()
    @Transform(({ value }: TransformFnParams) => new Date(String(value)))
    @IsDate()
    appointmentDate: Date;
    @ApiProperty({ enum: ['week', 'month', 'day'] })
    type: 'week' | 'month' | 'day';
}
