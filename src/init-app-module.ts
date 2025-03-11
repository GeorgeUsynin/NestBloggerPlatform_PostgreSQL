import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { CoreConfig } from './core/config';
import { DynamicModule } from '@nestjs/common';

export async function initAppModule(): Promise<DynamicModule> {
  /**
   * Because we need to further configure the dynamic AppModule, we cannot create the application immediately,
   * so we first create the context
   */
  const appContext = await NestFactory.createApplicationContext(AppModule);
  const coreConfig = appContext.get<CoreConfig>(CoreConfig);
  await appContext.close();

  return AppModule.forRoot(coreConfig);
}
