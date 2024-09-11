import { ApiProperty } from '@nestjs/swagger';
import { DoctorsViewDto } from '../../features/doctors/api/dto/output/doctors-view-dto';
import { PatientViewDto } from '../../features/patients/api/dto/output/patient-view.dto';

export class AppointmentPatientDoctorViewDto {
    @ApiProperty()
    appointmentId: string;
    @ApiProperty()
    datetimeOfAdmission: Date;
    @ApiProperty()
    patient: PatientViewDto;
    @ApiProperty()
    doctor: DoctorsViewDto;
    @ApiProperty()
    createdAt: Date;
}
