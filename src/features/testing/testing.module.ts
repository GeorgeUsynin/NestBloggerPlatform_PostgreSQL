import { Module } from '@nestjs/common';
import { TestingController } from './testing.controller';
import { BloggersPlatformModule } from '../bloggers-platform/bloggers-platform.module';
import { UsersAccountsModule } from '../user-accounts/usersAccounts.module';

@Module({
  imports: [BloggersPlatformModule, UsersAccountsModule],
  controllers: [TestingController],
})
export class TestingModule {}
