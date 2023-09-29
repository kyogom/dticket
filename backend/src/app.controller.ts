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
  interact(
    @Req() req: RawBodyRequest<Request>,
    @Body() body,
    // @Res() res: Response,
  ): any {
    return this.appService.handleInteractInit(req, body);
  }
}
