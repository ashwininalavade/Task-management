import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './Dto/creat-task.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { TaskStatus } from './task-status.enum';
import { Repository } from 'typeorm';
import { GetFiletrDto } from './Dto/filter-task.dto';

@Injectable()
export class TasksService {

    constructor(
        @InjectRepository(Task)
        private tasksRespository: Repository<Task>,) {}

    async getTasks(filterDto: GetFiletrDto): Promise<Task[]> {
        const {status, search} = filterDto;
        let tasks = await this.tasksRespository.find();
        if(status) {
            tasks = tasks.filter(task => task.status === status)
        }
        if(search) {
            tasks = tasks.filter(task => {
                if(task.title.toLocaleLowerCase().includes(search) || task.description.includes(search)) {
                    return true;
                }
                return false;
            });
        }
        return tasks;
    }

    async getTaskById(id: string): Promise<Task | null> {
        let found = await this.tasksRespository.findOneBy({id})

        if(!found) {
            throw new NotFoundException(`Task with id ${id} not found`);
        }

        return found;
    }

    async createTask(createTaskDto: CreateTaskDto): Promise<Task | null> {
        const { title, description } = createTaskDto;
        const task = this.tasksRespository.create({
            title,
            description,
            status: TaskStatus.OPEN
        });

        await this.tasksRespository.save(task);
        return task;
    }

    async deleteTaskById(id: string) {
        const result = await this.tasksRespository.delete(id)
        if(result.affected === 0) {
            throw new NotFoundException(`Task with id ${id} not found`);
        }
    }

    async updateTaskStatus(id: string, status: TaskStatus): Promise<Task | null> {
        let task = await this.getTaskById(id);
        if (!task) {
            return null;
        }   
        task.status = status;
        await this.tasksRespository.save(task);
        return task;
    }
}
