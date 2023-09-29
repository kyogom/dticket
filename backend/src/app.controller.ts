import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('api/interactions')
  interact(@Req() req: Request, @Body() body): any {
    console.log('## Headers');
    console.log(req.headers);
    console.log('## Body');
    console.log(body);
    return 'test';
  }
}
