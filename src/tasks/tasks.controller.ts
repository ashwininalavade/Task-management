import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { Task, TaskStatus } from './task.model';
import { CreateTaskDto } from './Dto/creat-task.dto';
import { GetFiletrDto } from './Dto/filter-task.dto';
import { UpdateTaskStatusDto } from './Dto/update-status.dto';

@Controller('tasks')
export class TasksController {
    constructor(private tasksService: TasksService ) {}

    @Get()
    getTasks(@Query() filterDto: GetFiletrDto): Task[] {
        if(Object.keys(filterDto).length) {
            return this.tasksService.getTaskWithFilters(filterDto);
        } else {
            return this.tasksService.getAllTasks();
        }
    }

    @Get('/:id') 
    getTaskById(@Param('id') id: string) {
        return this.tasksService.getTaskById(id);
    }

    @Post()
    createTask(@Body() createTaskDto: CreateTaskDto) {
        return this.tasksService.createTask(createTaskDto);
    }

    @Delete('/:id')
    deleteTaskById(@Param('id') id: string) {
        return this.tasksService.deleteTaskById(id);
    }

    @Patch('/:id/status')
    updateTaskStatus(@Param('id') id: string, @Body() updateTaskStatusDto: UpdateTaskStatusDto) {
        const { status } = updateTaskStatusDto;
        return this.tasksService.updateTaskStatus(id, status);
    }
}
