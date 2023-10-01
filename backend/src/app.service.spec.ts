import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from './app.module';
import { AppService } from './app.service';
jest.mock('node-fetch', () => jest.fn());

describe('AppService', () => {
  let appService: AppService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    appService = app.get<AppService>(AppService);
  });

  // FIXME: 汚いのでリファクタする
  describe('createUser', () => {
    it('/api/authorize (POST)', async () => {
      jest.spyOn(appService, 'getToken').mockImplementation(
        () =>
          new Promise((resolve) => {
            resolve({
              access_token: 'example_access_token',
              expires_in: 3600,
              refresh_token: 'example_refresh_token',
              scope: 'example_scope',
              token_type: 'Bearer',
            });
          }),
      );

      const me = {
        avatar: 'avatar',
        email: 'exmaple@email.com',
        id: 'd23ac22a-38f9-4dbb-b426-a9c8d2a2e396',
        locale: 'ja',
        username: 'kyogo',
      };

      jest.spyOn(appService, 'fetchMe').mockImplementation(
        () =>
          new Promise((resolve) => {
            resolve(me);
          }),
      );

      const user = await appService.createUser({
        code: 'example',
        guild_id: 'example',
      });

      return expect(user).toEqual({
        data: {
          // FIXME: 英語版もテストする
          message: `ようこそ${me.username}さん`,
        },
      });
    });
  });
});
