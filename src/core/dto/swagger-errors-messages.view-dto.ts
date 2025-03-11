import { ApiProperty } from '@nestjs/swagger';
import { ErrorsMessages } from '../exceptions/domain-exceptions';

class FieldErrorDto implements ErrorsMessages {
  @ApiProperty({
    type: String,
    nullable: true,
    required: false,
    description: 'Message with error explanation for certain field',
  })
  message: string;

  @ApiProperty({
    type: String,
    nullable: true,
    required: false,
    description: 'What field/property of input model has error',
  })
  field: string | null;
}

export class SwaggerErrorsMessagesViewDto {
  @ApiProperty({
    type: [FieldErrorDto],
    nullable: true,
    required: false,
  })
  errorsMessages: FieldErrorDto[];
}
