import { Injectable } from '@nestjs/common';
import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { BlogsRepository } from '../../infrastructure/blogs.repository';

/**
 * Registration in IoC container is required
 * Warning! Use this approach only in exceptional cases.
 * This example is for demonstration purposes.
 * Such validation should be done in BLL.
 */

@ValidatorConstraint({ name: 'BlogIsExist', async: true })
@Injectable()
export class BlogIsExistConstraint implements ValidatorConstraintInterface {
  constructor(private readonly blogsRepository: BlogsRepository) {}
  async validate(value: any) {
    const blogIsExist = await this.blogsRepository.findBlogById(value);
    return Boolean(blogIsExist);
  }

  defaultMessage(validationArguments?: ValidationArguments): string {
    return `Blog with the specified blogId (${validationArguments?.value}) was not found.`;
  }
}

// https://github.com/typestack/class-validator?tab=readme-ov-file#custom-validation-decorators
export function BlogIsExist(
  property?: string,
  validationOptions?: ValidationOptions,
) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [property],
      validator: BlogIsExistConstraint,
    });
  };
}
