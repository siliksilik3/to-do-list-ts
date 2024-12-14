import { Module } from '@nestjs/common';
import { DatabaseService } from './database.service';

@Module({
  providers: [DatabaseService],
  exports: [DatabaseService], // export chtobi moznobile ispolzovatj vo vsem proekte!
})
export class DatabaseModule {}
