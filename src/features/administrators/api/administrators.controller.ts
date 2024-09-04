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

@ApiTags('Administrators')
@Controller('administrators')
export class AdministratorsController {
    @ApiOperation({ summary: 'Create a doctor' })
    @ApiBearerAuth('Authorization Token')
    @Post('doctor')
    @ApiCreatedResponse({
        description: 'The doctor was created',
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
    createDoctor(@Body() doctorInputDto: DoctorInputDto) {}

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
    removeDoctor(@Param('doctorId') doctorId: string) {}

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
    updateDoctor(
        @Param('doctorId') doctorId: string,
        @Body() doctorInputDto: DoctorInputDto,
    ) {}
}
