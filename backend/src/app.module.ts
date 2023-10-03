import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { InteractionsModule } from './interactions/interactions.module';

@Module({
  imports: [InteractionsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
