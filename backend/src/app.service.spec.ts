import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from './app.module';
import { AppService } from './app.service';

describe('AppService', () => {
  let appService: AppService;

  const mockData = {
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
    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: true,
      json: () => {
        return mockData.me;
      },
    });
  };

  describe('createUser', () => {
    it('should return ja createdUser', async () => {
      mockGetToken();
      mockGetMe();

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
    it('should return ja createdUser', async () => {
      mockGetToken();
      mockGetMe();
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
