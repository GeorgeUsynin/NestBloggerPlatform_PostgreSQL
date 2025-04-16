// Config module must be on the top of imports because it will initialize env variables when app is running for the first time
import { configModule } from './config-module';

import { DynamicModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { UsersAccountsModule } from './features/user-accounts/usersAccounts.module';
import { BloggersPlatformModule } from './features/bloggers-platform/bloggers-platform.module';
import { NotificationsModule } from './features/notification/notification.module';
import { TestingModule } from './features/testing/testing.module';
import { CoreModule } from './core/core.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ENVIRONMENTS } from './constants';
import { CoreConfig } from './core/config';
import { join } from 'path';
import { ThrottlerModule } from '@nestjs/throttler';
import { CqrsModule } from '@nestjs/cqrs';

@Module({
  imports: [
    // Serve static files from swagger-static folder
    ServeStaticModule.forRootAsync({
      useFactory: (coreConfig: CoreConfig) => {
        return [
          {
            rootPath: join(__dirname, '..', 'swagger-static'),
            serveRoot:
              coreConfig.NODE_ENV === ENVIRONMENTS.DEVELOPMENT ? '/' : '/api',
          },
        ];
      },
      inject: [CoreConfig],
    }),
    // Connect to PostgreSQL
    TypeOrmModule.forRootAsync({
      useFactory: (coreConfig: CoreConfig) => ({
        type: 'postgres',
        // url: coreConfig.POSTGRESQL_URL,
        autoLoadEntities: true,
        synchronize: true,
        host: 'localhost',
        port: 5432,
        username: 'nodejs',
        password: 'nodejs',
        database: 'TypeORMBloggerPlatform',
      }),
      inject: [CoreConfig],
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 10000,
        limit: 5,
      },
    ]),
    CqrsModule.forRoot(),
    CoreModule,
    UsersAccountsModule,
    BloggersPlatformModule,
    NotificationsModule,
    configModule,
  ],
  controllers: [AppController],
})
export class AppModule {
  static async forRoot(coreConfig: CoreConfig): Promise<DynamicModule> {
    /**
     * We use this sophisticated approach to add an optional module to the main modules.
     * We avoid accessing environment variables through process.env in the decorator because
     * decorators are executed during the compilation of all modules before the NestJS lifecycle starts
     */

    return {
      module: AppModule,
      imports: [...(coreConfig.INCLUDE_TESTING_MODULE ? [TestingModule] : [])], // Add dynamic modules here
    };
  }
}
