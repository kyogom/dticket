import {
  Body,
  Controller,
  Get,
  Post,
  RawBodyRequest,
  Req,
} from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('api/interactions')
  interact(@Req() req: RawBodyRequest<Request>, @Body() body): any {
    return this.appService.handleIncomingWebhook(req, body);
  }

  @Post('api/authorize')
  createUser(@Body() body): any {
    return this.appService.createUser(body);
  }
}
