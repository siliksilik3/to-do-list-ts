import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { BullModule } from '@nestjs/bullmq';
import { UPDATE_QUEUE } from './constants';
import { UpdateStatusProcessor } from './update-status.processor';

@Module({
  imports: [
    DatabaseModule,
    BullModule.forRoot({
      // 1st queues step
      //Queues bull- redis
      connection: {
        // connection to redis
        host: 'localhost',
        port: 6379,
      },
    }),
    BullModule.registerQueue({
      name: UPDATE_QUEUE, // Название очереди  from constants.ts
    }),
  ],
  controllers: [AppController],
  providers: [AppService, UpdateStatusProcessor], // Processor added to providers!!!
})
export class AppModule {}
