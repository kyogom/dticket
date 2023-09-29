import {
  Body,
  Controller,
  Get,
  Post,
  RawBodyRequest,
  Req,
  Res,
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
    return this.appService.handleInteractInit(req, body);
  }

  @Post('api/authorize')
  exchangeCodeForToken(@Body() body): any {
    return this.appService.exchangeCodeForToken(body);
  }
}
