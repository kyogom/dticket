import {
  HttpException,
  HttpStatus,
  Injectable,
  RawBodyRequest,
} from '@nestjs/common';
import {
  RequestBodyInteraction,
  ResponseBodyTokenExchange,
  ResponseBodyUsersMe,
} from './types';
import { BOT_PUBLIC_KEY, DISCORD_API_ENDPOINT } from './consts';
import { InteractionResponseType, verifyKey } from 'discord-interactions';
import dict from './dict';
import { PrismaService } from './prisma.service';
import { randomUUID } from 'crypto';

@Injectable()
export class AppService {
  constructor(private prisma: PrismaService) {}

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

  async exchangeCodeForToken(
    data: URLSearchParams,
  ): Promise<ResponseBodyTokenExchange> {
    const response = await fetch(`${DISCORD_API_ENDPOINT}/oauth2/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: data,
    });
    if (!response.ok) {
      throw new HttpException(
        'cannot get token message:' + JSON.stringify(response.json()),
        HttpStatus.BAD_REQUEST,
      );
    }
    return (await response).json();
  }

  async fetchMe(access_token: string): Promise<ResponseBodyUsersMe> {
    return await (
      await fetch(`${DISCORD_API_ENDPOINT}/users/@me`, {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      })
    ).json();
  }

  async createUser(body: { code: string; guild_id: string }) {
    const { code, guild_id } = body;

    if (typeof code !== 'string' || typeof guild_id !== 'string') {
      throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST);
    }

    const data = new URLSearchParams();
    const { DISCORD_CLIENT_ID, DISCORD_CLIENT_SECRET, HOST_FRONTEND } =
      process.env;
    data.append('client_id', DISCORD_CLIENT_ID);
    data.append('client_secret', DISCORD_CLIENT_SECRET);
    data.append('grant_type', 'authorization_code');
    data.append('code', code);
    data.append('redirect_uri', `${HOST_FRONTEND}/oauth/callback`);

    const tokenResponse = await this.exchangeCodeForToken(data);
    const me = await this.fetchMe(tokenResponse.access_token);

    const createdUser = await this.prisma.helpdeskUsers.create({
      data: {
        accessToken: tokenResponse.access_token,
        email: me.email,
        locale: me.locale,
        name: me.username,
        organizations: {
          create: {
            id: randomUUID(),
            domain: me.username,
          },
        },
        refreshToken: tokenResponse.refresh_token,
      },
    });
    return {
      data: {
        message: dict['ようこそ%sさん'][createdUser.locale].replace(
          '%s',
          createdUser.name,
        ),
      },
    };
  }
}
