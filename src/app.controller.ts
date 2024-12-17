import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UsePipes,
  ValidationPipe,
  Render,
  Res,
} from '@nestjs/common';
import { AppService } from './app.service';
import { CreateDto } from './dto/create.dto';
import { Response } from 'express';

@Controller('/')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Render('index')
  async root() {
    // dla polucenija dannih nado async!!!
    const tasks = await this.appService.getAllTasks();
    return { tasks };
  }

  @UsePipes(new ValidationPipe()) // znacenije: Ispolzujem Pipes (kakoj mi hotim pipe) tut vibran vstojenij v nestJS i vse v Post prohodit sootvetstvujuseju proverku
  @Post('/create')
  async create(@Body() dto: CreateDto, @Res() res: Response) {
    await this.appService.save(dto);
    return res.redirect('/');
  }

  @Post('/delete/:id')
  async deleteTask(
    @Param('id', ParseIntPipe) id: number,
    @Res() res: Response,
  ) {
    await this.appService.deleteTask(id);
    return res.redirect('/');
  }

  @Post('/update/:id') // 2nd queues step (same Post as it benn before)
  async updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Res() res: Response,
  ) {
    console.log('Received ID:', id); // Логирование ID
    await this.appService.updateStatus(id);
    console.log('Task added to queue'); // Логирование после успешного выполнения
    return res.redirect('/');
  }

  @UsePipes(new ValidationPipe())
  @Post('/task/:id')
  async updateTask(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: CreateDto,
    @Res() res: Response,
  ) {
    await this.appService.updateTask(id, dto);
    return res.redirect('/');
  }
}
