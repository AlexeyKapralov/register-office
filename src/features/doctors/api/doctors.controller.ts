import {
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
    ApiNotFoundResponse,
    ApiOkResponse,
    ApiOperation,
    ApiQuery,
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
import { DoctorsService } from '../application/doctors.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth-guard';
import { RolesGuard } from '../../../base/guards/roles.guard';
import { Roles } from '../../../common/decorators/validate/roles.decorator';
import { Role } from '../../../base/models/role.enum';
import {
    DoctorsFreeSlotsViewDto,
    PeriodEnum,
} from './dto/output/doctors-free-slots-view.dto';
import { InterlayerStatuses } from '../../../base/models/interlayer';
import { FreeSlotsDoctorQueryDto } from './dto/input/free-slots-doctor-query.dto';
import { AccessTokenPayloadDto } from '../../../common/dto/access-token-payload.dto';
import { SchedulePeriodInputDto } from './dto/input/schedule-period-input.dto';

@ApiTags('Doctors')
@Controller('doctors')
export class DoctorsController {
    constructor(private doctorsService: DoctorsService) {}

    @ApiOperation({ summary: 'Get free slots for the doctor' })
    @ApiBearerAuth('Authorization Token')
    @Get('/free-slots/:doctorId')
    @ApiOkResponse({
        description: 'Info about doctor and free slots',
        type: DoctorsFreeSlotsViewDto,
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
    @ApiQuery({
        name: 'period',
        enum: PeriodEnum,
        example: 'day',
        required: false,
    })
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.Administrator, Role.Doctor)
    @HttpCode(HttpStatus.OK)
    async getFreeSLotsForDoctor(
        @Param('doctorId', ParseUUIDPipe) doctorId: string,
        @Query() query: FreeSlotsDoctorQueryDto,
    ) {
        const scheduleInterlayer =
            await this.doctorsService.getFreeSlotsByPeriod(doctorId, query);

        if (scheduleInterlayer.hasError()) {
            switch (scheduleInterlayer.extensions[0].code) {
                case InterlayerStatuses.NOT_FOUND:
                    throw new NotFoundException();
                case InterlayerStatuses.FORBIDDEN:
                    throw new NotFoundException();
                default:
                    break;
            }
        }

        return scheduleInterlayer.data;
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
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.Doctor)
    @HttpCode(HttpStatus.OK)
    async getInfoAboutMe(@Req() req: any): Promise<DoctorsViewDto | null> {
        const accessTokenPayload: AccessTokenPayloadDto = req.user;
        if (!accessTokenPayload.userId) {
            throw new UnauthorizedException();
        }

        const doctorInterLayer = await this.doctorsService.getDoctorByUserId(
            accessTokenPayload.userId,
        );
        if (doctorInterLayer.hasError()) {
            throw new NotFoundException();
        }

        return doctorInterLayer.data;
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
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.Doctor, Role.Administrator, Role.Patient)
    @HttpCode(HttpStatus.OK)
    async getInfoAboutDoctor(
        @Param('doctorId', ParseUUIDPipe) doctorId: string,
    ): Promise<DoctorsViewDto | null> {
        const doctorInterlayer =
            await this.doctorsService.getDoctorById(doctorId);
        if (doctorInterlayer.hasError()) {
            throw new NotFoundException();
        }
        return doctorInterlayer.data;
    }

    @ApiOperation({ summary: 'Get schedule for period' })
    @ApiBearerAuth('Authorization Token')
    @Get('schedule-for-day/:doctorId')
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
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.Doctor, Role.Administrator, Role.Patient)
    @HttpCode(HttpStatus.OK)
    async getScheduleByDoctorId(
        @Param('doctorId', ParseUUIDPipe) doctorId: string,
        @Query() schedulePeriodInputDto: SchedulePeriodInputDto,
    ): Promise<ScheduleViewDto[] | null> {
        const scheduleInterlayer =
            await this.doctorsService.getScheduleForDoctor(
                doctorId,
                schedulePeriodInputDto,
            );
        if (scheduleInterlayer.hasError()) {
            throw new NotFoundException();
        }

        return !scheduleInterlayer.data ? [] : scheduleInterlayer.data;
    }

    @ApiOperation({ summary: 'Get doctor appointments' })
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
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.Doctor)
    @HttpCode(HttpStatus.OK)
    async getDoctorsAppointments(
        @Query() appointmentsDateInputDto: AppointmentsDateInputDto,
        @Req() req: any,
    ) {
        const accessTokenPayload: AccessTokenPayloadDto = req.user;
        if (!accessTokenPayload.userId) {
            throw new UnauthorizedException();
        }

        const appointmentsInterlayer =
            await this.doctorsService.getAppointments(
                appointmentsDateInputDto.startDate,
                appointmentsDateInputDto.finishDate,
                accessTokenPayload.userId,
            );
        if (appointmentsInterlayer.hasError()) {
            throw new NotFoundException();
        }
        return appointmentsInterlayer.data;
    }

    @ApiOperation({ summary: 'Create schedule for day' })
    @ApiBearerAuth('Authorization Token')
    @Post('schedule-for-day/:doctorId')
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
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.Administrator, Role.Doctor)
    @HttpCode(HttpStatus.CREATED)
    async createWorkScheduleForDay(
        @Body() scheduleDateInputDto: SchedulePeriodByDateInputDto,
        @Param('doctorId', ParseUUIDPipe) doctorId: string,
        @Req()
        req: any,
    ) {
        const createScheduleInterlayer =
            await this.doctorsService.createScheduleForDay(
                doctorId,
                scheduleDateInputDto.workDate,
                scheduleDateInputDto.startDate,
                scheduleDateInputDto.finishDate,
            );

        if (createScheduleInterlayer.hasError()) {
            throw new ForbiddenException();
        }
    }

    @ApiOperation({ summary: 'Update schedule for day' })
    @ApiBearerAuth('Authorization Token')
    @Put('schedule-for-day/:doctorId')
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
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.Administrator, Role.Doctor)
    @HttpCode(HttpStatus.CREATED)
    async updateWorkScheduleForDay(
        @Body() scheduleDateInputDto: SchedulePeriodByDateInputDto,
        @Req() req: any,
        @Param('doctorId', ParseUUIDPipe) doctorId: string,
    ) {
        const createScheduleInterlayer =
            await this.doctorsService.updateScheduleForDay(
                doctorId,
                scheduleDateInputDto.workDate,
                scheduleDateInputDto.startDate,
                scheduleDateInputDto.finishDate,
            );

        if (createScheduleInterlayer.hasError()) {
            throw new ForbiddenException();
        }
    }

    @ApiOperation({ summary: 'Delete schedule for day' })
    @ApiBearerAuth('Authorization Token')
    @Delete('schedule-for-day/:doctorId')
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
    @ApiNotFoundResponse({
        description: 'Not Found',
    })
    @ApiForbiddenResponse({
        description: 'Forbidden',
    })
    async deleteWorkScheduleForDay(
        @Body() scheduleDateInputDto: DeleteScheduleInputDto,
        @Req() req: any,
        @Param('doctorId', ParseUUIDPipe) doctorId: string,
    ) {
        const deleteScheduleInterlayer =
            await this.doctorsService.deleteScheduleForDay(
                doctorId,
                scheduleDateInputDto.workDate,
            );

        if (
            deleteScheduleInterlayer.extensions[0].code ===
            InterlayerStatuses.FORBIDDEN
        ) {
            throw new ForbiddenException();
        }

        if (
            deleteScheduleInterlayer.extensions[0].code ===
            InterlayerStatuses.NOT_FOUND
        ) {
            throw new NotFoundException();
        }
    }
}
