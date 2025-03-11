import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get('/')
  getVercelVersion(): { version: string } {
    return { version: '1.0' };
  }
}
