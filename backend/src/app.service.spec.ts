import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from './app.module';
import { AppService } from './app.service';
import mockData from './mock_data';

// Prepare Mock
const fetch = (global.fetch = jest.fn());
jest.mock('discord-interactions');

describe('AppService', () => {
  let appService: AppService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    appService = app.get<AppService>(AppService);
  });

  const mockGetToken = () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: () => {
        return mockData.token;
      },
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
    it('should return ja createdUser', async () => {
      mockGetToken();
      mockGetMe();
      mockPostCommand();

      const { code, guild_id } = mockData.createUserParam;
      return expect(await appService.createUser(code, guild_id)).toEqual({
        data: {
          message: `ようこそ${mockData.me.username}さん`,
        },
      });
    });
  });

  describe('createUser', () => {
    it('should return en createdUser', async () => {
      mockGetToken();
      mockGetMe();
      mockPostCommand();
      mockData.me.locale = 'en';

      const { code, guild_id } = mockData.createUserParam;
      return expect(await appService.createUser(code, guild_id)).toEqual({
        data: {
          message: `${mockData.me.username}, Welcome to DiscordTicket`,
        },
      });
    });
  });
});
