import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from './app.module';
import { AppService } from './app.service';

const fetch = (global.fetch = jest.fn());
describe('AppService', () => {
  let appService: AppService;

  const mockData = {
    channels: {},
    guild: {
      id: 'bcdc90ec-259e-4bf9-a89b-c1b56fb94c58',
      name: 'hello',
      icon: '26444d28-bb54-4887-ac3b-2cafcdfe74a9',
      approximate_member_count: 10,
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

  const mockGetGuild = () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: () => {
        return mockData.me;
      },
    });
  };

  const mockGetChannels = () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: () => {
        return mockData.channels;
      },
    });
  };

  describe('createUser', () => {
    // FIXME: prismaもモックする
    it('should return ja createdUser', async () => {
      mockGetToken();
      mockGetMe();
      mockGetGuild();
      mockGetChannels();

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
    it('should return ja createdUser', async () => {
      mockGetToken();
      mockGetMe();
      mockGetGuild();
      mockGetChannels();
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
