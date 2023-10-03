import {
  HttpException,
  HttpStatus,
  Injectable,
  RawBodyRequest,
} from '@nestjs/common';
import { RequestBodyInteraction } from '../types';
import {
  InteractionResponseType,
  InteractionType,
  verifyKey,
} from 'discord-interactions';

@Injectable()
export class InteractionsService {
  async handleIncomingWebhook(
    req: RawBodyRequest<Request>,
    body: RequestBodyInteraction,
  ) {
    const signature = req.headers['x-signature-ed25519'] ?? '';
    const timestamp = req.headers['x-signature-timestamp'] ?? '';
    const rawBody = req.rawBody;
    const isVerified = verifyKey(
      rawBody,
      signature,
      timestamp,
      process.env.BOT_PUBLIC_KEY,
    );

    if (!isVerified) {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }

    if (body.type === InteractionType.PING) {
      return {
        type: InteractionResponseType.PONG,
      };
    }

    if (body.type === InteractionType.APPLICATION_COMMAND) {
      return {
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          // TODO: 多言語対応
          content: 'done',
        },
      };
    }

    return {};
  }
}
