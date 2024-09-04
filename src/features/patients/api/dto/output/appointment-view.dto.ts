import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsUUID } from 'class-validator';

export class SlotsInfo {
    @ApiProperty({ default: 'day', enum: ['day', 'week', 'month'] })
    periodType: 'day' | 'week' | 'month';

    @ApiProperty({ default: '1 April' })
    period: string;

    @ApiProperty({ default: 3 })
    countSlots: number;

    @ApiProperty({
        type: [Date],
        default: [
            '2023-04-27T9:30:00.000Z',
            '2023-04-27T12:00:00.000Z',
            '2023-04-27T15:30:00.000Z',
        ],
    })
    freeSlots: [string];
}

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
    phone_number: string;

    @ApiProperty()
    specialization: string;

    @ApiProperty()
    slotsInfo: SlotsInfo;
}
