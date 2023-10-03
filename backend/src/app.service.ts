import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ResponseBodyTokenExchange, ResponseBodyUsersMe } from './types';
import { DISCORD_API_ENDPOINT } from './consts';
import { randomUUID } from 'crypto';
import DictService from './dict.service';
import prisma from '../prisma/client';
import wrappedFetch from './fetchClient';

@Injectable()
export class AppService {
  constructor() {}

  getHello(): string {
    return 'Hello World!';
  }

  async getToken(data: URLSearchParams): Promise<ResponseBodyTokenExchange> {
    const response = await wrappedFetch(
      `${DISCORD_API_ENDPOINT}/oauth2/token`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: data,
      },
    );
    return (await response).json();
  }

  async createUser(body: { code: string; guild_id: string }) {
    const { code, guild_id } = body;

    if (typeof code !== 'string' || typeof guild_id !== 'string') {
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

    const meResponse = await wrappedFetch(`${DISCORD_API_ENDPOINT}/users/@me`, {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });
    const me: ResponseBodyUsersMe = await meResponse.json();

    const existingUser = await prisma.helpdeskUsers.findFirst({
      where: {
        discordId: me.id,
      },
    });
    if (existingUser === null) {
      await prisma.helpdeskUsers.create({
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
    const commandResponse = await wrappedFetch(
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

    // TODO: Webhookを作る。WebhookIDなどをDBに保存する

    return {
      data: {
        message: t('ようこそ%sさん', [me.username]),
      },
    };
  }
}
