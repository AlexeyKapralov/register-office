import { ApiProperty } from '@nestjs/swagger';

export class PatientViewDto {
    @ApiProperty()
    name: string;
    @ApiProperty()
    dob: string;
    @ApiProperty()
    city: string;
    @ApiProperty()
    medicalPolicy: string;
    @ApiProperty()
    passport: string;
    @ApiProperty()
    phonNumber: string;
}
