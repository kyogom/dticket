import { Injectable } from '@nestjs/common';
import { RequestBodyInteraction } from './types';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  handleInteractInit(req: Request, body: RequestBodyInteraction) {
    console.log(req);
    console.log(body);
    throw Error('implement me!'); //TODO: implement
    return 'test';
  }
}
