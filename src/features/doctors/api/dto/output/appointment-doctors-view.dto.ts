import { PatientViewDto } from '../../../../patients/api/dto/output/patient-view.dto';
import { ApiProperty } from '@nestjs/swagger';

export class AppointmentDoctorsViewDto {
    @ApiProperty({
        default: '550e8400-e29b-41d4-a716-446655440000',
    })
    appointmentId: string;
    @ApiProperty({
        default: '2024-09-04T05:17:00.212Z',
    })
    datetimeOfAdmission: string;
    @ApiProperty()
    patient: PatientViewDto;
    @ApiProperty({
        default: '2024-09-04T05:17:00.212Z',
    })
    createdAt: string;
}
