import {
  HttpException,
  HttpStatus,
  Injectable,
  RawBodyRequest,
} from '@nestjs/common';
import { RequestBodyInteraction } from './types';
import { BOT_PUBLIC_KEY } from './consts';
import { InteractionResponseType, verifyKey } from 'discord-interactions';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  handleInteractInit(
    req: RawBodyRequest<Request>,
    body: RequestBodyInteraction,
  ) {
    const signature = req.headers['x-signature-ed25519'] ?? '';
    const timestamp = req.headers['x-signature-timestamp'] ?? '';
    const rawBody = req.rawBody;
    const isVerified = verifyKey(rawBody, signature, timestamp, BOT_PUBLIC_KEY);

    // https://discord.com/developers/docs/interactions/receiving-and-responding#security-and-authorization
    if (!isVerified) {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }

    if (body.type === InteractionResponseType.PONG) {
      return {
        type: InteractionResponseType.PONG,
      };
    }

    return {};
  }

  exchangeCodeForToken(body: { code: string; guild_id: string }) {
    const { code, guild_id } = body;

    if (typeof code !== 'string' || typeof guild_id !== 'string') {
      throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST);
    }

    // TODO:コードを交換する
    // https://discord.com/developers/docs/topics/oauth2#authorization-code-grant-access-token-exchange-example
    console.log(code, guild_id);
    return {};
  }
}
