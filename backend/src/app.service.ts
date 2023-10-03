import { Injectable } from '@nestjs/common';
import {
  ResponseBodyCommand,
  ResponseBodyTokenExchange,
  ResponseBodyUsersMe,
} from './types';
import { DISCORD_API_ENDPOINT } from './consts';
import { randomUUID } from 'crypto';
import DictService from './dict.service';
import prisma from '../prisma/client';
import wrappedFetch from './fetchClient';

const {
  APPLICATION_ID,
  BOT_TOKEN,
  DISCORD_CLIENT_ID,
  DISCORD_CLIENT_SECRET,
  HOST_FRONTEND,
} = process.env;

@Injectable()
export class AppService {
  async createUser(code: string, guild_id: string) {
    const { access_token, refresh_token } =
      await wrappedFetch<ResponseBodyTokenExchange>(
        `${DISCORD_API_ENDPOINT}/oauth2/token`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams({
            client_id: DISCORD_CLIENT_ID,
            client_secret: DISCORD_CLIENT_SECRET,
            grant_type: 'authorization_code',
            code,
            redirect_uri: `${HOST_FRONTEND}/oauth/callback`,
          }),
        },
      );

    const me = await wrappedFetch<ResponseBodyUsersMe>(
      `${DISCORD_API_ENDPOINT}/users/@me`,
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      },
    );

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
    const command = await wrappedFetch<ResponseBodyCommand>(
      `${DISCORD_API_ENDPOINT}/applications/${APPLICATION_ID}/guilds/${guild_id}/commands`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bot ' + BOT_TOKEN,
        },
        body: JSON.stringify({
          type: 3,
          name: 'Reply email',
          name_localizations: {
            ja: 'メールで返信',
            'en-US': 'Reply email',
            'en-GB': 'Reply email',
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
