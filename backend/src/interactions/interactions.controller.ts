import { Body, Controller, Post, RawBodyRequest, Req } from '@nestjs/common';
import { InteractionsService } from './interactions.service';

@Controller('api/interactions')
export class InteractionsController {
  constructor(private readonly interactionsService: InteractionsService) {}

  @Post()
  interact(@Req() req: RawBodyRequest<Request>, @Body() body): any {
    return this.interactionsService.handleIncomingWebhook(req, body);
  }
}
