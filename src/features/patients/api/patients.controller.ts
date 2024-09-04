import {
    Body,
    Controller,
    Delete,
    HttpCode,
    HttpStatus,
    Param,
    Post,
    Put,
} from '@nestjs/common';
import {
    ApiBadRequestResponse,
    ApiBearerAuth,
    ApiCreatedResponse,
    ApiNoContentResponse,
    ApiOperation,
    ApiTags,
    ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AppointmentInputDto } from './dto/input/appointment-input.dto';
import { ApiErrorResult } from '../../../base/models/api-error-result';

@ApiTags('Patients')
@Controller('patients')
export class PatientsController {
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
    @HttpCode(HttpStatus.NO_CONTENT)
    updateAppointment(
        @Param('appointmentId') appointmentId: string,
        @Body() appointmentInputDto: AppointmentInputDto,
    ) {}
}
