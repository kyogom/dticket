import { Test, TestingModule } from '@nestjs/testing';
import { InteractionsService } from './interactions.service';
import { createRequest } from 'node-mocks-http';
import {
  InteractionResponseType,
  InteractionType,
  verifyKey,
} from 'discord-interactions';
import { RawBodyRequest } from '@nestjs/common';

// Prepare Mock
jest.mock('discord-interactions');

describe('InteractionsService', () => {
  let interactionsService: InteractionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [InteractionsService],
    }).compile();

    interactionsService = module.get<InteractionsService>(InteractionsService);
  });

  describe('handleIncomingWebhook', () => {
    it('should PONG', async () => {
      (verifyKey as any).mockReturnValue(true);
      const req = createRequest({
        method: 'POST',
      });
      return expect(
        await interactionsService.handleIncomingWebhook(
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
});
