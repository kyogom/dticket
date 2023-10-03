import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from './app.module';
import { AppService } from './app.service';

const fetch = (global.fetch = jest.fn());
describe('AppService', () => {
  let appService: AppService;

  const mockData = {
    command: {
      id: '1158560657030004736',
      application_id: '1158543325788389406',
      version: '1158560657030004737',
      default_member_permissions: null,
      type: 3,
      name: 'Send this message via email',
      name_localizations: {
        ja: 'メールで返信',
        'en-US': 'Send this message via email',
        'en-GB': 'Send this message via email',
      },
      description: '',
      description_localizations: null,
      guild_id: '959619584644776028',
      nsfw: false,
    },
    me: {
      avatar: 'avatar',
      email: 'exmaple@email.com',
      id: 'd23ac22a-38f9-4dbb-b426-a9c8d2a2e396',
      locale: 'ja',
      username: 'kyogo',
    },
    createUserParam: {
      code: 'example',
      guild_id: 'example',
    },
  };

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    appService = app.get<AppService>(AppService);
  });

  const mockGetToken = () => {
    jest.spyOn(appService, 'getToken').mockResolvedValueOnce({
      access_token: 'example_access_token',
      expires_in: 3600,
      refresh_token: 'example_refresh_token',
      scope: 'example_scope',
      token_type: 'Bearer',
    });
  };
  const mockGetMe = () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: () => {
        return mockData.me;
      },
    });
  };

  const mockPostCommand = () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: () => {
        return mockData.command;
      },
    });
  };

  describe('createUser', () => {
    // FIXME: prismaもモックする
    it('should return ja createdUser', async () => {
      mockGetToken();
      mockGetMe();
      mockPostCommand();

      return expect(
        await appService.createUser(mockData.createUserParam),
      ).toEqual({
        data: {
          message: `ようこそ${mockData.me.username}さん`,
        },
      });
    });
  });

  describe('createUser', () => {
    // FIXME: prismaもモックする
    it('should return en createdUser', async () => {
      mockGetToken();
      mockGetMe();
      mockPostCommand();
      mockData.me.locale = 'en';

      return expect(
        await appService.createUser(mockData.createUserParam),
      ).toEqual({
        data: {
          message: `${mockData.me.username}, Welcome to DiscordTicket`,
        },
      });
    });
  });
});
