import { Injectable } from '@nestjs/common';
import { CreateEmailConfirmationDto } from '../domain/dto/create/emailConfirmation.create-dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { EmailConfirmation } from '../domain/emailConfirmation.entity';

@Injectable()
export class EmailConfirmationsRepository {
  // Injection of the model through DI
  constructor(
    @InjectRepository(EmailConfirmation)
    private emailConfirmationsRepository: Repository<EmailConfirmation>,
  ) {}

  create(dto: CreateEmailConfirmationDto) {
    return this.emailConfirmationsRepository.create(dto);
  }

  async save(emailConfirmation: EmailConfirmation) {
    return this.emailConfirmationsRepository.save(emailConfirmation);
  }
}
