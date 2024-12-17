import { Injectable } from '@nestjs/common'; //service ETO PROVAJDERI!!!
import { CreateDto } from './dto/create.dto';
import { DatabaseService } from './database/database.service';
import { UPDATE_QUEUE } from './constants';
import { Queue } from 'bullmq';
import { InjectQueue } from '@nestjs/bullmq';

@Injectable()
export class AppService {
  constructor(
    private readonly databaseService: DatabaseService,
    @InjectQueue(UPDATE_QUEUE) private readonly updateQueue: Queue, // inhekcija queue!!!
  ) {} //injekcija!!! appmodul importirujet database modul a database modul eksportirujet database service!

  //------------------------------------------------------------------------------
  async getAllTasks() {
    return this.databaseService.task.findMany({
      orderBy: {
        id: 'asc',
      },
    }); // Возвращает массив объектов Task
  }

  async save(dto: CreateDto) {
    // dla togo chtobi sohranat v bazu dannih nado sdelat inject nasego servisa bazi dannih (construktor)
    return this.databaseService.task.create({ data: dto }); // etot dbservice model task, sozdojem s opredelennimi dannimi (dto)
  } // mi polucili vozmoznostj sohranitj danije v baze danih
  // mozno spolzovatj v CONTROLLER!!!

  async deleteTask(id: number) {
    await this.databaseService.task.delete({
      where: {
        id: id,
      },
    });
  }

  async updateStatus(id: number) {
    // 3rd queues step
    const found = await this.databaseService.task.findUnique({
      where: {
        id: id,
      },
    });
    const newStatus = !found.isDone;
    await this.databaseService.task.update({
      where: {
        id,
      },
      data: {
        isDone: newStatus,
      },
    });
    if (newStatus) {
      await this.updateQueue.add('updateStatus', { id }, { delay: 1000 * 5 }); //добавляет задачу в очередь с отложенной обработкой.
    }
  }

  async updateTask(id: number, dto: CreateDto) {
    await this.databaseService.task.update({
      where: {
        id: id,
      },
      data: {
        task: dto.task,
      },
    });
  }
}
