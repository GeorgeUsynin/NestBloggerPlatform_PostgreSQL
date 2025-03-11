import { PipeTransform, Injectable } from '@nestjs/common';
import { isValidObjectId } from 'mongoose';
import { BadRequestDomainException } from '../exceptions/domain-exceptions';

@Injectable()
export class ObjectIdValidationPipe
  implements PipeTransform<string, Promise<string>>
{
  async transform(value: string): Promise<string> {
    if (!isValidObjectId(value)) {
      throw BadRequestDomainException.create(
        `Invalid ObjectId format: ${value}`,
        'userId',
      );
    }

    return value;
  }
}
