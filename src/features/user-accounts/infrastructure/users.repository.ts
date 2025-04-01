import { Injectable } from '@nestjs/common';
import { NotFoundDomainException } from '../../../core/exceptions/domain-exceptions';
import { CreateUserDto } from '../domain/dto/create/users.create-dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../domain/user.entity';

@Injectable()
export class UsersRepository {
  // Injection of the model through DI
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  create(dto: CreateUserDto) {
    return this.usersRepository.create(dto);
  }

  async findUserById(id: number): Promise<User | null> {
    return this.usersRepository.findOneBy({ id });
  }

  async findUserByIdOrNotFoundFail(id: number): Promise<User> {
    const user = await this.usersRepository.findOneBy({ id });

    if (!user) {
      throw NotFoundDomainException.create('User not found');
    }

    return user;
  }

  async findUserByLogin(login: string): Promise<User | null> {
    return this.usersRepository.findOneBy({ login });
  }

  async findUserByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOneBy({ email });
  }

  async findUserByLoginOrEmail(loginOrEmail: string): Promise<User | null> {
    return this.usersRepository.findOne({
      where: [{ login: loginOrEmail }, { email: loginOrEmail }],
    });
  }

  async deleteAllUsers() {
    return this.usersRepository.delete({});
  }

  async softDeleteUserById(id: number) {
    return this.usersRepository.softDelete(id);
  }

  async save(user: User) {
    return this.usersRepository.save(user);
  }
}
