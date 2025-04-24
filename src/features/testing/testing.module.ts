import { Module } from '@nestjs/common';
import { TestingController } from './testing.controller';
import { BloggersPlatformModule } from '../bloggers-platform/bloggers-platform.module';
import { UsersAccountsModule } from '../user-accounts/usersAccounts.module';
import { QuizGameModule } from '../quiz-game/quiz-game.module';

@Module({
  imports: [BloggersPlatformModule, UsersAccountsModule, QuizGameModule],
  controllers: [TestingController],
})
export class TestingModule {}
