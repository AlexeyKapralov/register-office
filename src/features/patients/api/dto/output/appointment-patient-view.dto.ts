import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsUUID } from 'class-validator';
import { SlotsInfoViewDto } from './slots-info-view.dto';
import { DoctorsViewDto } from '../../../../doctors/api/dto/output/doctors-view-dto';
import { PatientViewDto } from './patient-view.dto';

export class AppointmentPatientViewDto {
    @ApiProperty()
    appointmentId: string;

    @ApiProperty()
    datetimeOfAdmission: Date;
    @ApiProperty()
    doctor: DoctorsViewDto;
    @ApiProperty()
    createdAt: Date;
}
