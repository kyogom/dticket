import {
  HttpException,
  HttpStatus,
  Injectable,
  RawBodyRequest,
} from '@nestjs/common';
import { RequestBodyInteraction } from './types';
import { BOT_PUBLIC_KEY, DISCORD_API_ENDPOINT } from './consts';
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

  async exchangeCodeForToken(body: { code: string; guild_id: string }) {
    const { code, guild_id } = body;

    if (typeof code !== 'string' || typeof guild_id !== 'string') {
      throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST);
    }
    console.log(code, guild_id);

    const data = new URLSearchParams();
    const { DISCORD_CLIENT_ID, DISCORD_CLIENT_SECRET, HOST } = process.env;
    data.append('client_id', DISCORD_CLIENT_ID);
    data.append('client_secret', DISCORD_CLIENT_SECRET);
    data.append('grant_type', 'authorization_code');
    data.append('code', code);
    data.append('redirect_uri', HOST);

    // try {
    //   const response = await fetch(`${DISCORD_API_ENDPOINT}/oauth2/token`, {
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'application/x-www-form-urlencoded',
    //     },
    //     body: data,
    //   });

    //   if (!response.ok) {
    //     throw new HttpException('cannot get token', HttpStatus.BAD_REQUEST);
    //   }
    //   console.log('token exchange success');
    //   console.log(response.json());
    // } catch (error) {
    //   throw new Error(error.message);
    // }

    return {};
  }
}
