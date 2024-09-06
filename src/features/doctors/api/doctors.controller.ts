import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Put,
    Query,
} from '@nestjs/common';
import {
    ApiBadRequestResponse,
    ApiBearerAuth,
    ApiCreatedResponse,
    ApiForbiddenResponse,
    ApiNoContentResponse,
    ApiOkResponse,
    ApiOperation,
    ApiTags,
    ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { ApiErrorResult } from '../../../base/models/api-error-result';
import { DoctorsViewDto } from './dto/output/doctors-view-dto';
import { SchedulePeriodByDateInputDto } from './dto/input/schedule-period-by-date-input.dto';
import { AppointmentsDateInputDto } from './dto/input/appointments-date-input.dto';
import { ScheduleViewDto } from './dto/output/shedule-view.dto';
import { AppointmentDoctorsViewDto } from './dto/output/appointment-doctors-view.dto';
import { DeleteScheduleInputDto } from './dto/input/delete-schedule-input.dto';

@ApiTags('Doctors')
@Controller('doctors')
export class DoctorsController {
    @ApiOperation({ summary: 'Get free slots for the doctor' })
    @ApiBearerAuth('Authorization Token')
    @Get('/free-slots/:doctorId')
    @ApiNoContentResponse({
        description: 'Info about doctor and free slots',
        type: AppointmentDoctorsViewDto,
    })
    @ApiBadRequestResponse({
        type: ApiErrorResult,
        description: 'If the inputModel has incorrect values',
    })
    @ApiUnauthorizedResponse({
        description: 'Unauthorized',
    })
    @ApiForbiddenResponse({
        description: 'Forbidden',
    })
    getFreeSLotsForDoctor(@Param('doctorId') doctorId: string) {
        return {
            doctorId: '550e8400-e29b-41d4-a716-446655440000',
            name: 'string',
            region: 'string',
            city: 'string',
            phoneNumber: 'string',
            specialization: 'string',
            slotsInfo: {
                periodType: 'day',
                period: '1 April',
                countSlots: 3,
                freeSlots: [
                    '2023-04-27T9:30:00.000Z',
                    '2023-04-27T12:00:00.000Z',
                    '2023-04-27T15:30:00.000Z',
                ],
            },
        };
    }

    @ApiOperation({ summary: 'Get info about current doctor' })
    @ApiBearerAuth('Authorization Token')
    @Get('me')
    @ApiOkResponse({
        description: 'Info about doctor from JWT',
        type: DoctorsViewDto,
    })
    @ApiBadRequestResponse({
        type: ApiErrorResult,
        description: 'If the inputModel has incorrect values',
    })
    @ApiUnauthorizedResponse({
        description: 'Unauthorized',
    })
    @ApiForbiddenResponse({
        description: 'Forbidden',
    })
    getInfoAboutMe() {
        return {
            doctorId: '550e8400-e29b-41d4-a716-446655440000',
            name: 'Ivan Ivanov',
            region: 'MO',
            city: 'Balashikha',
            phoneNumber: '+7-965-125-55-82',
            specialization: 'Terapy',
            dob: '1992-04-27T9:30:00.000Z',
        };
    }

    @ApiOperation({ summary: 'Get info about the doctor' })
    @ApiBearerAuth('Authorization Token')
    @Get(':doctorId')
    @ApiOkResponse({
        description: 'Info about doctor',
        type: DoctorsViewDto,
    })
    @ApiBadRequestResponse({
        type: ApiErrorResult,
        description: 'If the inputModel has incorrect values',
    })
    @ApiUnauthorizedResponse({
        description: 'Unauthorized',
    })
    @ApiForbiddenResponse({
        description: 'Forbidden',
    })
    getInfoAboutDoctor(@Param('doctorId') doctorId: string) {
        return {
            doctorId: '550e8400-e29b-41d4-a716-446655440000',
            name: 'Ivan Ivanov',
            region: 'MO',
            city: 'Balashikha',
            phoneNumber: '+7-965-125-55-82',
            specialization: 'Terapy',
            dob: '1992-04-27T9:30:00.000Z',
        };
    }

    @ApiOperation({ summary: 'Get appointments' })
    @ApiBearerAuth('Authorization Token')
    @Get('appointments')
    @ApiOkResponse({
        description: `Doctor's appointments`,
        type: [AppointmentDoctorsViewDto],
    })
    @ApiBadRequestResponse({
        type: ApiErrorResult,
        description: 'If the inputModel has incorrect values',
    })
    @ApiUnauthorizedResponse({
        description: 'Unauthorized',
    })
    @ApiForbiddenResponse({
        description: 'Forbidden',
    })
    getAppointments(
        @Query() appointmentsDateInputDto: AppointmentsDateInputDto,
    ) {
        return [
            {
                appointmentId: '550e8400-e29b-41d4-a716-446655440000',
                datetimeOfAdmission: '2024-04-2908:00:00.000Z',
                patient: {
                    name: 'Ivan Ivanov',
                    dob: '1992-04-27T9:30:00.000Z',
                    city: 'Balashikha',
                    medicalPolicy: '1234567890111234',
                    passport: '4601729721',
                    phoneNumber: '+7-965-125-55-82',
                },
                createdAt: '2024-04-27T9:30:00.000Z',
            },
            {
                appointmentId: '650e8400-e29b-41d4-a716-446655440000',
                datetimeOfAdmission: '2024-04-2908:30:00.000Z',
                patient: {
                    name: 'Nikolay Ivanov',
                    dob: '1992-04-27T9:30:00.000Z',
                    city: 'Pushkino',
                    medicalPolicy: '1234567890111234',
                    passport: '4601729721',
                    phoneNumber: '+7-965-125-55-82',
                },
                createdAt: '2024-04-27T18:30:00.000Z',
            },
        ];
    }

    @ApiOperation({ summary: 'Get schedule for period' })
    @ApiBearerAuth('Authorization Token')
    @Get('schedule-for-day')
    @ApiOkResponse({
        description: `Doctor's schedule for period`,
        type: [ScheduleViewDto],
    })
    @ApiBadRequestResponse({
        type: ApiErrorResult,
        description: 'If the inputModel has incorrect values',
    })
    @ApiUnauthorizedResponse({
        description: 'Unauthorized',
    })
    @ApiForbiddenResponse({
        description: 'Forbidden',
    })
    getScheduleByDoctorId(
        @Query() schedulePeriodInputDto: SchedulePeriodByDateInputDto,
    ) {
        return [
            {
                date: '2024-04-29T08:00:00.000Z',
                countAppointments: 3,
                startWorkTime: '2024-04-29T9:30:00.000Z',
                endWorkTime: '2024-04-29T19:00:00.000Z',
            },
            {
                date: '2024-04-28T08:00:00.000Z',
                countAppointments: 5,
                startWorkTime: '2024-04-28T9:30:00.000Z',
                endWorkTime: '2024-04-28T13:00:00.000Z',
            },
        ];
    }

    @ApiOperation({ summary: 'Create schedule for day' })
    @ApiBearerAuth('Authorization Token')
    @Post('schedule-for-day')
    @ApiCreatedResponse({
        description: `Schedule was created`,
    })
    @ApiBadRequestResponse({
        type: ApiErrorResult,
        description: 'If the inputModel has incorrect values',
    })
    @ApiUnauthorizedResponse({
        description: 'Unauthorized',
    })
    @ApiForbiddenResponse({
        description: 'Forbidden',
    })
    createWorkScheduleForDay(
        @Body() scheduleDateInputDto: SchedulePeriodByDateInputDto,
    ) {}

    @ApiOperation({ summary: 'Update schedule for day' })
    @ApiBearerAuth('Authorization Token')
    @Put('schedule-for-day')
    @ApiCreatedResponse({
        description: `Schedule was updated`,
    })
    @ApiBadRequestResponse({
        type: ApiErrorResult,
        description: 'If the inputModel has incorrect values',
    })
    @ApiUnauthorizedResponse({
        description: 'Unauthorized',
    })
    @ApiForbiddenResponse({
        description: 'Forbidden',
    })
    updateWorkScheduleForDay(
        @Body() scheduleDateInputDto: SchedulePeriodByDateInputDto,
    ) {}

    @ApiOperation({ summary: 'Delete schedule for day' })
    @ApiBearerAuth('Authorization Token')
    @Delete('schedule-for-day')
    @ApiCreatedResponse({
        description: `Schedule was delete`,
    })
    @ApiBadRequestResponse({
        type: ApiErrorResult,
        description: 'If the inputModel has incorrect values',
    })
    @ApiUnauthorizedResponse({
        description: 'Unauthorized',
    })
    @ApiForbiddenResponse({
        description: 'Forbidden',
    })
    deleteWorkScheduleForDay(
        @Body() scheduleDateInputDto: DeleteScheduleInputDto,
    ) {}
}
