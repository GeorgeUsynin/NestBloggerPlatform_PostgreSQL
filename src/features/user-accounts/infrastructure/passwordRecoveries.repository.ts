import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { PasswordRecovery } from '../domain/passwordRecovery.entity';
import { CreatePasswordRecoveryDto } from '../domain/dto/create/passwordRecovery.create-dto';

type TRelations = ['user'];

@Injectable()
export class PasswordRecoveriesRepository {
  // Injection of the model through DI
  constructor(
    @InjectRepository(PasswordRecovery)
    private passwordRecoveriesRepository: Repository<PasswordRecovery>,
  ) {}

  create(dto: CreatePasswordRecoveryDto) {
    return this.passwordRecoveriesRepository.create(dto);
  }

  async findPasswordRecoveryByUserId(userId: number) {
    return this.passwordRecoveriesRepository.findOneBy({ userId });
  }

  async findPasswordRecoveryByRecoveryCode(
    recoveryCode: string,
    relations?: TRelations,
  ) {
    const relationMap = relations?.length
      ? Object.fromEntries(relations.map((relation) => [relation, true]))
      : undefined;

    return this.passwordRecoveriesRepository.findOne({
      where: { recoveryCode },
      relations: relationMap,
    });
  }

  async save(passwordRecovery: PasswordRecovery) {
    return this.passwordRecoveriesRepository.save(passwordRecovery);
  }
}
