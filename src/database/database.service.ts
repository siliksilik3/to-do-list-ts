import { INestApplication, Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class DatabaseService extends PrismaClient {
  async onModuleInit() {
    await this.$connect(); // podklucajem bazu dannih
  }

  async onModuleDestroy() {
    await this.$disconnect(); // otklucajemssja ot bazi dannih
  }

  async enableShutdownHooks(app: INestApplication) {
    process.on('beforeExit', async () => {
      // slusajet i v slucaje prinuditelnogo nasego otklucenija ot bazi dannih srabativajet
      await app.close();
    });
  }
}
