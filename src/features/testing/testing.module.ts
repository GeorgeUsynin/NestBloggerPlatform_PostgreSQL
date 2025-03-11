import { Module } from '@nestjs/common';
import { TestingController } from './testing.controller';
import { UsersAccountsModule } from '../user-accounts/usersAccounts.module';
import { BloggersPlatformModule } from '../bloggers-platform/bloggers-platform.module';

@Module({
  imports: [BloggersPlatformModule, UsersAccountsModule],
  controllers: [TestingController],
})
export class TestingModule {}
