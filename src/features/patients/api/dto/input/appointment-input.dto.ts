import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsUUID } from 'class-validator';
import { Transform, TransformFnParams } from 'class-transformer';

export class AppointmentInputDto {
    @ApiProperty({
        default: '2024-09-10T15:00:00.000Z',
    })
    @Transform(({ value }: TransformFnParams) => new Date(String(value)))
    @IsDate()
    datetimeOfAdmission: Date;

    @ApiProperty({
        default: '550e8400-e29b-41d4-a716-446655440000',
    })
    @IsUUID()
    doctorId: string;
}
