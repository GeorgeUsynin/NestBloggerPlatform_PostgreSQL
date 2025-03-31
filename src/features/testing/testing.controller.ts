import { Controller, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { TestingAllDataApi } from './swagger/testing-all-data.decorator';
import { UsersRepository } from '../user-accounts/infrastructure/users.repository';

@Controller('testing')
export class TestingController {
  constructor(private usersRepository: UsersRepository) {}

  @Delete('all-data')
  @HttpCode(HttpStatus.NO_CONTENT)
  @TestingAllDataApi()
  async deleteAll() {
    await this.usersRepository.deleteAllUsers();
    // await this.dataSource.query(`DELETE FROM "AuthDeviceSessions"`);
    // await this.dataSource.query(`DELETE FROM "Blogs"`);
    // await this.dataSource.query(`DELETE FROM "Posts"`);
    // await this.dataSource.query(`DELETE FROM "Comments"`);
    // await this.dataSource.query(`DELETE FROM "Likes"`);
  }
}
