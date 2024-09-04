import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsUUID } from 'class-validator';

export class AppointmentInputDto {
    @ApiProperty()
    @IsDate()
    datetimeOfAdmission: Date;

    @ApiProperty({
        default: '550e8400-e29b-41d4-a716-446655440000',
    })
    @IsUUID()
    doctorId: string;
}
