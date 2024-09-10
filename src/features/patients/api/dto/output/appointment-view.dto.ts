import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsUUID } from 'class-validator';
import { SlotsInfoViewDto } from './slots-info-view.dto';

export class AppointmentViewDto {
    @ApiProperty({ default: '550e8400-e29b-41d4-a716-446655440000' })
    doctorId: Date;

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
    slotsInfo: SlotsInfoViewDto;
}
