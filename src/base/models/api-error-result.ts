import { ApiPropertyOptional } from '@nestjs/swagger';

export class FieldError {
    @ApiPropertyOptional({
        description: 'Message with error explanation for certain field',
    })
    message: string;
    @ApiPropertyOptional({
        description: 'What field/property of input model has error',
    })
    field: string;
}

export class ApiErrorResult {
    @ApiPropertyOptional({ type: [FieldError] })
    errorsMessages: [FieldError];
}
