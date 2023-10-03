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
import { DISCORD_API_ENDPOINT } from './consts';
import {
  InteractionResponseType,
  InteractionType,
  verifyKey,
} from 'discord-interactions';
import { PrismaService } from './prisma.service';
import { randomUUID } from 'crypto';
import DictService from './dict.service';

@Injectable()
export class AppService {
  constructor(private prisma: PrismaService) {}

  getHello(): string {
    return 'Hello World!2';
  }

  async handleInteractInit(
    req: RawBodyRequest<Request>,
    body: RequestBodyInteraction & { webhookTest: boolean },
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

  async getToken(data: URLSearchParams): Promise<ResponseBodyTokenExchange> {
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

  async createUser(body: { code: string; guild_id: string }) {
    const { code, guild_id } = body;

    if (typeof code !== 'string') {
      throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST);
    }

    const {
      APPLICATION_ID,
      BOT_TOKEN,
      DISCORD_CLIENT_ID,
      DISCORD_CLIENT_SECRET,
      HOST_FRONTEND,
    } = process.env;

    const { access_token, refresh_token } = await this.getToken(
      new URLSearchParams({
        client_id: DISCORD_CLIENT_ID,
        client_secret: DISCORD_CLIENT_SECRET,
        grant_type: 'authorization_code',
        code,
        redirect_uri: `${HOST_FRONTEND}/oauth/callback`,
      }),
    );

    const meResponse = await fetch(`${DISCORD_API_ENDPOINT}/users/@me`, {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });
    if (!meResponse.ok) {
      throw new HttpException(
        'cannot get me message:' + JSON.stringify(await meResponse.json()),
        HttpStatus.BAD_REQUEST,
      );
    }
    const me: ResponseBodyUsersMe = await meResponse.json();

    const existingUser = await this.prisma.helpdeskUsers.findUnique({
      where: {
        discordId: me.id,
      },
    });
    if (existingUser === null) {
      await this.prisma.helpdeskUsers.create({
        data: {
          accessToken: access_token,
          discordId: me.id,
          email: me.email,
          icon: me.avatar,
          locale: me.locale,
          name: me.username,
          organizations: {
            create: {
              id: randomUUID(),
              domain: me.username,
              name: me.username,
            },
          },
          refreshToken: refresh_token,
        },
      });
    } else {
      // TODO: updateしたい
    }

    const { t } = new DictService(me.locale);

    // TODO: コマンドIDなどをDBに保存する?
    const commandResponse = await fetch(
      `${DISCORD_API_ENDPOINT}/applications/${APPLICATION_ID}/guilds/${guild_id}/commands`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bot ' + BOT_TOKEN,
        },
        body: JSON.stringify({
          type: 3,
          name: 'Send this message via email',
          name_localizations: {
            ja: 'メールで返信',
            'en-US': 'Send this message via email',
            'en-GB': 'Send this message via email',
          },
        }),
      },
    );
    if (!commandResponse.ok) {
      throw new HttpException(
        'cannot create command:' + JSON.stringify(await commandResponse.json()),
        HttpStatus.BAD_REQUEST,
      );
    }

    // TODO: Webhookを作る。WebhookIDなどをDBに保存する

    return {
      data: {
        message: t('ようこそ%sさん', [me.username]),
      },
    };
  }
}
