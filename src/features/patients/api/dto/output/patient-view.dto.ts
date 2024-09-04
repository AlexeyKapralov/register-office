import { ApiProperty } from '@nestjs/swagger';

export class PatientViewDto {
    @ApiProperty()
    name: string;
    @ApiProperty()
    dob: string;
    @ApiProperty()
    city: string;
    @ApiProperty()
    medical_policy: string;
    @ApiProperty()
    passport: string;
    @ApiProperty()
    phone_number: string;
}
