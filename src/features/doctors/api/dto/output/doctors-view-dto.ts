import { ApiProperty } from '@nestjs/swagger';

export class DoctorsViewDto {
    @ApiProperty({ default: '550e8400-e29b-41d4-a716-446655440000' })
    doctorId: string;

    @ApiProperty()
    name: string;

    @ApiProperty()
    region: string;

    @ApiProperty()
    city: string;

    @ApiProperty()
    phoneNumber: string;

    @ApiProperty()
    specialization: string;

    @ApiProperty()
    dob: Date;
}
