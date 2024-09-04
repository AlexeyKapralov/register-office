import { ApiProperty } from '@nestjs/swagger';
import { DoctorsViewDto } from '../../../../doctors/api/dto/output/doctors-view-dto';

export class AppointmentPatientsViewDto {
    @ApiProperty({
        default: '550e8400-e29b-41d4-a716-446655440000',
    })
    appointmentId: string;
    @ApiProperty({
        default: '2024-09-04T05:17:00.212Z',
    })
    datetimeOfAdmission: string;
    @ApiProperty()
    doctor: DoctorsViewDto;
    @ApiProperty({
        default: '2024-09-04T05:17:00.212Z',
    })
    createdAt: string;
}
