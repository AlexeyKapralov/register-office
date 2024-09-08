import {
    Body,
    Controller,
    Delete,
    ForbiddenException,
    HttpCode,
    HttpStatus,
    NotFoundException,
    Param,
    ParseUUIDPipe,
    Post,
    Put,
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
    ApiOperation,
    ApiTags,
    ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { ApiErrorResult } from '../../../base/models/api-error-result';
import { DoctorInputDto } from '../../doctors/api/dto/input/doctor-input.dto';
import { AdministratorsService } from '../application/administrators.service';
import { Logger } from 'nestjs-pino';
import { DoctorsViewDto } from '../../doctors/api/dto/output/doctors-view-dto';
import { DoctorInputUpdateDto } from '../../doctors/api/dto/input/doctor-input-update.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth-guard';
import { AccessTokenPayloadDto } from '../../../common/dto/access-token-payload.dto';
import { Roles } from '../../../common/decorators/validate/roles.decorator';
import { Role } from '../../../base/models/role.enum';
import { RolesGuard } from '../../../base/guards/roles.guard';

@ApiTags('Administrators')
@Controller('administrators')
export class AdministratorsController {
    constructor(
        private readonly administratorsService: AdministratorsService,
        private readonly logger: Logger,
    ) {}

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.Administrator)
    @ApiOperation({ summary: 'Create a doctor' })
    @ApiBearerAuth('Authorization Token')
    @Post('doctor')
    @ApiCreatedResponse({
        description: 'The doctor was created',
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
        description: 'Doctor already exists',
    })
    @HttpCode(HttpStatus.CREATED)
    async createDoctor(
        @Body() doctorInputDto: DoctorInputDto,
        @Req() req: any,
    ) {
        const accessTokenPayload: AccessTokenPayloadDto = req.user;
        if (!accessTokenPayload.userId) {
            throw new UnauthorizedException();
        }

        const doctorInterlayer =
            await this.administratorsService.createDoctor(doctorInputDto);
        if (doctorInterlayer.hasError()) {
            throw new ForbiddenException({
                message: 'login or email already exist',
            });
        }
        return doctorInterlayer.data;
    }

    @ApiOperation({ summary: 'Delete the doctor' })
    @ApiBearerAuth('Authorization Token')
    @Delete('doctor/:doctorId')
    @ApiNoContentResponse({
        description: 'The doctor was deleted',
    })
    @ApiBadRequestResponse({
        type: ApiErrorResult,
        description: 'If the inputModel has incorrect values',
    })
    @ApiUnauthorizedResponse({
        description: 'Unauthorized',
    })
    @ApiNotFoundResponse({
        description: 'Doctor did not found',
    })
    @ApiForbiddenResponse({
        description: 'You do not have enough permissions',
    })
    @HttpCode(HttpStatus.NO_CONTENT)
    async removeDoctor(@Param('doctorId', ParseUUIDPipe) doctorId: string) {
        const removeDoctorInterlayer =
            await this.administratorsService.removeDoctor(doctorId);
        if (removeDoctorInterlayer.hasError()) {
            throw new NotFoundException();
        }
    }

    @ApiOperation({ summary: 'Update the doctor' })
    @ApiBearerAuth('Authorization Token')
    @Put('doctor/:doctorId')
    @ApiNoContentResponse({
        description: 'The doctor was updated',
    })
    @ApiBadRequestResponse({
        type: ApiErrorResult,
        description: 'If the inputModel has incorrect values',
    })
    @ApiUnauthorizedResponse({
        description: 'Unauthorized',
    })
    @ApiNotFoundResponse({
        description: 'Doctor did not found',
    })
    @ApiForbiddenResponse({
        description: 'You do not have enough permissions',
    })
    @HttpCode(HttpStatus.NO_CONTENT)
    async updateDoctor(
        @Param('doctorId') doctorId: string,
        @Body() doctorInputDto: DoctorInputUpdateDto,
    ) {
        const updateDoctorInterLayer =
            await this.administratorsService.updateDoctor(
                doctorId,
                doctorInputDto,
            );
        if (updateDoctorInterLayer.hasError()) {
            throw new ForbiddenException();
        }
    }
}
