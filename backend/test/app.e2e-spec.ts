import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { AppService } from './../src/app.service';
import { InteractionResponseType, InteractionType } from 'discord-interactions';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let appService: AppService;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    appService = app.get<AppService>(AppService);
  });

  it('/api/interactions (POST | verify)', () => {
    jest
      .spyOn(appService, 'handleIncomingWebhook')
      .mockResolvedValue({ type: InteractionResponseType.PONG });
    return request(app.getHttpServer())
      .post('/api/interactions')
      .send({ type: InteractionType.PING })
      .expect(201);
  });

  it('/api/interactions (POST | handle command)', () => {
    jest.spyOn(appService, 'handleIncomingWebhook').mockResolvedValue({
      type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
      data: {
        content: 'done',
      },
    });

    return request(app.getHttpServer())
      .post('/api/interactions')
      .send({ type: InteractionType.APPLICATION_COMMAND })
      .expect(201)
      .then((res) => {
        expect(res.body).toEqual({
          type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
          data: {
            content: 'done',
          },
        });
      });
  });

  it('/api/authorize (POST)', () => {
    const responseMessage = 'kyogo, Welcome to DiscordTicket';
    jest.spyOn(appService, 'createUser').mockResolvedValue({
      data: {
        message: responseMessage,
      },
    });
    return request(app.getHttpServer())
      .post('/api/authorize')
      .send({ code: '', guild_id: '' })
      .expect(201)
      .then((res) => {
        expect(res.body).toEqual({
          data: {
            message: responseMessage,
          },
        });
      });
  });
});
