import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from './app.module';
import { AppService } from './app.service';
import mockData from './mockData';
import {
  InteractionResponseType,
  InteractionType,
  verifyKey,
} from 'discord-interactions';
import { createRequest } from 'node-mocks-http';
import { RawBodyRequest } from '@nestjs/common';

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
    jest.spyOn(appService, 'getToken').mockResolvedValueOnce({
      access_token: 'example_access_token',
      refresh_token: 'example_refresh_token',
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

  describe('handleIncomingWebhook', () => {
    it('should PONG', async () => {
      (verifyKey as any).mockReturnValue(true);
      const req = createRequest({
        method: 'POST',
      });
      return expect(
        await appService.handleIncomingWebhook(
          req as unknown as RawBodyRequest<Request>,
          {
            type: InteractionType.PING,
          },
        ),
      ).toEqual({
        type: InteractionResponseType.PONG,
      });
    });
  });

  describe('createUser', () => {
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
