import {
  HttpException,
  HttpStatus,
  Injectable,
  RawBodyRequest,
} from '@nestjs/common';
import {
  RequestBodyInteraction,
  ResponseBodyChannel,
  ResponseBodyGuild,
  ResponseBodyTokenExchange,
  ResponseBodyUsersMe,
} from './types';
import { BOT_PUBLIC_KEY, DISCORD_API_ENDPOINT } from './consts';
import { InteractionResponseType, verifyKey } from 'discord-interactions';
import { PrismaService } from './prisma.service';
import { randomUUID } from 'crypto';
import DictService from './dict.service';

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

    if (typeof code !== 'string' || typeof guild_id !== 'string') {
      throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST);
    }

    const { DISCORD_CLIENT_ID, DISCORD_CLIENT_SECRET, HOST_FRONTEND } =
      process.env;

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

    const guildsResponse = await fetch(
      `${DISCORD_API_ENDPOINT}/users/@me/guilds?with_counts=true`,
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      },
    );

    if (!guildsResponse.ok) {
      throw new HttpException(
        'cannot get guild message:' +
          JSON.stringify(await guildsResponse.json()),
        HttpStatus.BAD_REQUEST,
      );
    }
    const guilds: ResponseBodyGuild[] = await guildsResponse.json();
    const guild = guilds.find((guild) => guild.id === guild_id);

    const createdUser = await this.prisma.helpdeskUsers.create({
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
            name: guild.name,
            icon: guild.icon,
            systemChannelId: guild.system_channel_id,
          },
        },
        refreshToken: refresh_token,
      },
    });

    // const channels: ResponseBodyChannel = await (
    //   await fetch(`${DISCORD_API_ENDPOINT}/guilds/${guild_id}/channels`, {
    //     headers: {
    //       Authorization: `Bearer ${access_token}`,
    //     },
    //   })
    // ).json();

    const { t } = new DictService(createdUser.locale);

    return {
      data: {
        message: t('ようこそ%sさん', [createdUser.name]),
      },
    };
  }
}
