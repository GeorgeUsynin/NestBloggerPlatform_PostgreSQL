import { Controller, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { TestingAllDataApi } from './swagger/testing-all-data.decorator';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Controller('testing')
export class TestingController {
  constructor(@InjectDataSource() private dataSource: DataSource) {}

  @Delete('all-data')
  @HttpCode(HttpStatus.NO_CONTENT)
  @TestingAllDataApi()
  async deleteAll() {
    await this.dataSource.query(`DELETE FROM "Users"`);
    await this.dataSource.query(`DELETE FROM "AuthDeviceSessions"`);
    await this.dataSource.query(`DELETE FROM "Blogs"`);
    await this.dataSource.query(`DELETE FROM "Posts"`);
    await this.dataSource.query(`DELETE FROM "Comments"`);
    await this.dataSource.query(`DELETE FROM "Likes"`);
  }
}
