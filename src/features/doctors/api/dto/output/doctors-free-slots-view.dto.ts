import { ApiProperty } from '@nestjs/swagger';
import { SlotsInfoViewDto } from '../../../../patients/api/dto/output/slots-info-view.dto';

export class DoctorsFreeSlotsViewDto {
    @ApiProperty()
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

    @ApiProperty({ type: SlotsInfoViewDto })
    slotsInfo: SlotsInfoViewDto;
}

export enum PeriodEnum {
    Day = 'day',
    Week = 'week',
    Month = 'month',
}
