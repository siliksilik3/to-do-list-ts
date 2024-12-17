import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { UPDATE_QUEUE } from './constants';
import { DatabaseService } from './database/database.service';

@Processor(UPDATE_QUEUE) // Название очереди 'updateStatus' 4th step to add processor!
export class UpdateStatusProcessor extends WorkerHost {
  constructor(private readonly databaseService: DatabaseService) {
    super();
  }
  // Обработка задачи на удаление
  async process(job: Job<{ id: number }>): Promise<any> {
    const { id } = job.data;

    console.log(`Deleting task with id: ${id}`);
    // Удаляем задачу из базы данных
    await this.databaseService.task.delete({
      where: {
        id,
      },
    });
    console.log(`Task with id ${id} deleted successfully.`);
  }
}
