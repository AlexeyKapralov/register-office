import { ApiProperty } from '@nestjs/swagger';

export class SlotsInfoViewDto {
    @ApiProperty({ default: 'day', enum: ['day', 'week', 'month'] })
    periodType: 'day' | 'week' | 'month';

    @ApiProperty({ default: '2023-04-27T9:30:00.000Z' })
    periodStart: string;

    @ApiProperty({ default: '2023-04-27T9:30:00.000Z' })
    periodEnd: string;

    @ApiProperty({ default: 3 })
    countSlots: number;

    @ApiProperty({
        default: [
            {
                date: '2023-04-27T9:30:00.000Z',
                slosts: [
                    '2023-04-27T9:30:00.000Z',
                    '2023-04-27T12:00:00.000Z',
                    '2023-04-27T15:30:00.000Z',
                ],
            },
        ],
    })
    freeSlots: freeSlots[];
}

export type freeSlots = {
    date: Date;
    slots: string[];
};
