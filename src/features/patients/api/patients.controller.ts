import {
    BadRequestException,
    Body,
    Controller,
    Delete,
    ForbiddenException,
    Get,
    HttpCode,
    HttpStatus,
    NotFoundException,
    Param,
    ParseUUIDPipe,
    Post,
    Put,
    Query,
    Req,
    UnauthorizedException,
    UseGuards,
} from '@nestjs/common';
import {
    ApiBadRequestResponse,
    ApiBearerAuth,
    ApiCreatedResponse,
    ApiForbiddenResponse,
    ApiNoContentResponse,
    ApiNotFoundResponse,
    ApiOkResponse,
    ApiOperation,
    ApiTags,
    ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AppointmentInputDto } from './dto/input/appointment-input.dto';
import { ApiErrorResult } from '../../../base/models/api-error-result';
import { AppointmentsDateInputDto } from '../../doctors/api/dto/input/appointments-date-input.dto';
import { AppointmentPatientViewDto } from './dto/output/appointment-patient-view.dto';
import { AccessTokenPayloadDto } from '../../../common/dto/access-token-payload.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth-guard';
import { RolesGuard } from '../../../base/guards/roles.guard';
import { Roles } from '../../../common/decorators/validate/roles.decorator';
import { Role } from '../../../base/models/role.enum';
import { PatientsService } from '../application/patients.service';
import { InterlayerStatuses } from '../../../base/models/interlayer';
import { AppointmentInputOptionalDto } from './dto/input/appointment-input-optional.dto';
import { AppointmentPatientDoctorViewDto } from '../../../common/dto/appointment-patient-view.dto';

@ApiTags('Patients')
@Controller('patients')
export class PatientsController {
    constructor(private readonly patientsService: PatientsService) {}

    @ApiOperation({ summary: 'Get appointments' })
    @ApiBearerAuth('Authorization Token')
    @Get('appointments')
    @ApiOkResponse({
        description: `Patient's appointments`,
        type: [AppointmentPatientViewDto],
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
    @ApiNotFoundResponse({
        description: 'NotFound',
    })
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.Patient)
    async getPatientsAppointments(
        @Query() appointmentsDateInputDto: AppointmentsDateInputDto,
        @Req() req: any,
    ) {
        const accessTokenPayload: AccessTokenPayloadDto = req.user;
        if (!accessTokenPayload.userId) {
            throw new UnauthorizedException();
        }

        const appointmentsInterlayer =
            await this.patientsService.getAppointments(
                appointmentsDateInputDto.startDate,
                appointmentsDateInputDto.finishDate,
                accessTokenPayload.userId,
            );

        if (appointmentsInterlayer.hasError()) {
            throw new NotFoundException();
        }
        return appointmentsInterlayer.data;
    }

    @ApiOperation({ summary: 'Make an appointment' })
    @ApiBearerAuth('Authorization Token')
    @Post('appointment')
    @ApiCreatedResponse({
        description: 'The appointment was created',
        type: AppointmentPatientDoctorViewDto,
    })
    @ApiBadRequestResponse({
        type: ApiErrorResult,
        description: 'If the inputModel has incorrect values',
    })
    @ApiUnauthorizedResponse({
        description: 'Unauthorized',
    })
    @ApiNotFoundResponse({
        description: 'Not found doctor',
    })
    @ApiForbiddenResponse({
        description:
            'You do not have enough permissions or your time is not available',
    })
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.Patient)
    @HttpCode(HttpStatus.CREATED)
    async makeAppointment(
        @Body() appointmentInputDto: AppointmentInputDto,
        @Req() req: any,
    ) {
        const accessTokenPayload: AccessTokenPayloadDto = req.user;
        if (!accessTokenPayload.userId) {
            throw new UnauthorizedException();
        }

        const appointmentInterlayer =
            await this.patientsService.createAppointment(
                appointmentInputDto.datetimeOfAdmission,
                appointmentInputDto.doctorId,
                accessTokenPayload.userId,
            );
        if (appointmentInterlayer.hasError() || !appointmentInterlayer.data) {
            throw new NotFoundException();
        }
        return appointmentInterlayer.data;
    }

    @ApiOperation({ summary: 'Delete an appointment' })
    @ApiBearerAuth('Authorization Token')
    @Delete('appointment/:appointmentId/:doctorId')
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
    @ApiNotFoundResponse({
        description: 'Not found appointment',
    })
    @ApiBadRequestResponse({
        description: 'Appointment was not deleted',
    })
    @ApiForbiddenResponse({
        description: 'You do not have enough permissions',
    })
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.Patient)
    @HttpCode(HttpStatus.NO_CONTENT)
    async deleteAppointment(
        @Param('appointmentId', ParseUUIDPipe) appointmentId: string,
        @Param('doctorId', ParseUUIDPipe) doctorId: string,
        @Req() req: any,
    ) {
        const accessTokenPayload: AccessTokenPayloadDto = req.user;
        if (!accessTokenPayload.userId) {
            throw new UnauthorizedException();
        }

        const deleteAppointmentInterlayer =
            await this.patientsService.deleteAppointment(
                appointmentId,
                doctorId,
                accessTokenPayload.userId,
            );
        switch (deleteAppointmentInterlayer.code) {
            case InterlayerStatuses.NOT_FOUND:
                throw new NotFoundException();
            case InterlayerStatuses.FORBIDDEN:
                throw new ForbiddenException();
            case InterlayerStatuses.BAD_REQUEST:
                throw new BadRequestException();
            default:
                break;
        }
    }

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
    @ApiNotFoundResponse({
        description: 'Not found appointment or doctor ',
    })
    @ApiForbiddenResponse({
        description:
            'You do not have enough permissions or your date is not available',
    })
    @ApiBadRequestResponse({
        description: 'Appointment was not updated',
    })
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.Patient)
    @HttpCode(HttpStatus.NO_CONTENT)
    async updateAppointment(
        @Param('appointmentId', ParseUUIDPipe) appointmentId: string,
        @Body() appointmentInputDto: AppointmentInputOptionalDto,
        @Req() req: any,
    ) {
        const accessTokenPayload: AccessTokenPayloadDto = req.user;
        if (!accessTokenPayload.userId) {
            throw new UnauthorizedException();
        }

        const isUpdatedAppointmentInterlayer =
            await this.patientsService.updateAppointment(
                appointmentId,
                accessTokenPayload.userId,
                appointmentInputDto.datetimeOfAdmission,
                appointmentInputDto.doctorId,
            );

        if (isUpdatedAppointmentInterlayer.hasError()) {
            switch (isUpdatedAppointmentInterlayer.code) {
                case InterlayerStatuses.NOT_FOUND:
                    throw new NotFoundException();
                case InterlayerStatuses.FORBIDDEN:
                    throw new ForbiddenException();
                case InterlayerStatuses.BAD_REQUEST:
                    throw new BadRequestException();
                default:
                    break;
            }
        }
    }
}
