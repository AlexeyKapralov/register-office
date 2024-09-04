import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    HttpStatus,
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
import { AppointmentInputDto } from './dto/input/appointment-input.dto';
import { ApiErrorResult } from '../../../base/models/api-error-result';
import { AppointmentsDateInputDto } from '../../doctors/api/dto/input/appointments-date-input.dto';
import { AppointmentPatientsViewDto } from './dto/output/appointment-patients-view.dto';

@ApiTags('Patients')
@Controller('patients')
export class PatientsController {
    @ApiOperation({ summary: 'Get appointments' })
    @ApiBearerAuth('Authorization Token')
    @Get('appointments')
    @ApiOkResponse({
        description: `Patient's appointments`,
        type: [AppointmentPatientsViewDto],
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
                doctor: {
                    doctorId: '550e8400-e29b-41d4-a716-446655440000',
                    name: 'Ivan Ivanov',
                    region: 'MO',
                    city: 'Balashikha',
                    phone_number: '+7-965-125-55-82',
                    specialization: 'Terapy',
                    dob: '1992-04-27T9:30:00.000Z',
                },
                createdAt: '2024-04-27T9:30:00.000Z',
            },
            {
                appointmentId: '650e8400-e29b-41d4-a716-446655440000',
                datetimeOfAdmission: '2024-04-2908:30:00.000Z',
                doctor: {
                    doctorId: '550e8400-e29b-41d4-a716-446655440000',
                    name: 'Ivan Ivanov',
                    region: 'MO',
                    city: 'Balashikha',
                    phone_number: '+7-965-125-55-82',
                    specialization: 'Terapy',
                    dob: '1992-04-27T9:30:00.000Z',
                },
                createdAt: '2024-04-27T18:30:00.000Z',
            },
        ];
    }

    @ApiOperation({ summary: 'Make an appointment' })
    @ApiBearerAuth('Authorization Token')
    @Post()
    @ApiCreatedResponse({
        description: 'The appointment was created',
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
    @HttpCode(HttpStatus.CREATED)
    makeAppointment(@Body() appointmentInputDto: AppointmentInputDto) {}

    @ApiOperation({ summary: 'Delete an appointment' })
    @ApiBearerAuth('Authorization Token')
    @Delete(':appointmentId')
    @ApiNoContentResponse({
        description: 'The appointment was deleted',
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
    @HttpCode(HttpStatus.NO_CONTENT)
    removeAppointment(@Param('appointmentId') appointmentId: string) {}

    @ApiOperation({ summary: 'Update an appointment' })
    @ApiBearerAuth('Authorization Token')
    @Put(':appointmentId')
    @ApiNoContentResponse({
        description: 'The appointment was updated',
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
    @HttpCode(HttpStatus.NO_CONTENT)
    updateAppointment(
        @Param('appointmentId') appointmentId: string,
        @Body() appointmentInputDto: AppointmentInputDto,
    ) {}
}
