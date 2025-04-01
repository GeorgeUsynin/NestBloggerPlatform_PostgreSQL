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

  async findEmailConfirmationByUserId(userId: number) {
    return this.emailConfirmationsRepository.findOneBy({ userId });
  }

  async findEmailConfirmationByConfirmationCode(confirmationCode: string) {
    return this.emailConfirmationsRepository.findOneBy({ confirmationCode });
  }

  async save(emailConfirmation: EmailConfirmation) {
    return this.emailConfirmationsRepository.save(emailConfirmation);
  }
}
