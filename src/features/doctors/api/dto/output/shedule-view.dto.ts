import { ApiProperty } from '@nestjs/swagger';

export class ScheduleViewDto {
    @ApiProperty({
        example: '2024-09-04T05:40:55.083Z',
    })
    date: string;
    @ApiProperty({
        example: '2024-09-04T05:40:55.083Z',
    })
    startWorkTime: string;
    @ApiProperty({
        example: '2024-09-04T05:40:55.083Z',
    })
    endWorkTime: string;
}
