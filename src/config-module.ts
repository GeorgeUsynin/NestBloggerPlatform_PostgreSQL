import { ConfigModule } from '@nestjs/config';
import { join } from 'path';

// We must import this configModule at the top level of our app.module.ts
export const configModule = ConfigModule.forRoot({
  envFilePath: [
    // process.env.ENV_FILE_PATH?.trim() || '', - to override env variables using path to the new env file from where the app will be running
    join(__dirname, `./env/.env.${process.env.NODE_ENV}.local`),
    join(__dirname, `./env/.env.${process.env.NODE_ENV}`),
    join(__dirname, `./env/.env.production`),
  ],
  isGlobal: true,
});
