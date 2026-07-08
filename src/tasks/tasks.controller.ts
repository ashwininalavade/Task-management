import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './Dto/creat-task.dto';
import { GetFiletrDto } from './Dto/filter-task.dto';
import { UpdateTaskStatusDto } from './Dto/update-status.dto';
import { Task } from './task.entity';
import { AuthGuard } from '@nestjs/passport';
import { User } from 'src/auth/user.entity';
import { GetUser } from 'src/auth/get-user.decorator';
import { Logger } from '@nestjs/common';

@Controller('tasks')
@UseGuards(AuthGuard())
export class TasksController {
    private logger = new Logger('tasks');
    constructor(private tasksService: TasksService ) {}

    @Get()
    getTasks(@Query() filterDto: GetFiletrDto,
            @GetUser() user: User): Promise<Task[]> {
        this.logger.verbose(`user ${user.username} retrieving all tasks with filters ${JSON.stringify(filterDto)}`);
        return this.tasksService.getTasks(filterDto, user);
    }

    @Get('/:id') 
    getTaskById(@Param('id') id: string, @GetUser() user: User): Promise<Task | null> {
        return this.tasksService.getTaskById(id, user);
    }

    @Post()
    createTask(@Body() createTaskDto: CreateTaskDto, 
                @GetUser() user: User): Promise<Task | null> {
        this.logger.verbose(`user ${user.username} creating new task with parameters ${JSON.stringify(createTaskDto)}`);
        return this.tasksService.createTask(createTaskDto, user);
    }

    @Delete('/:id')
    deleteTaskById(@Param('id') id: string, @GetUser() user: User) {
        return this.tasksService.deleteTaskById(id, user);
    }

    @Patch('/:id/status')
    updateTaskStatus(@Param('id') id: string, @Body() updateTaskStatusDto: UpdateTaskStatusDto, @GetUser() user: User) {
        const { status } = updateTaskStatusDto;
        return this.tasksService.updateTaskStatus(id, status, user);
    }
}
