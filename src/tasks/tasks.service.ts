import { Injectable, NotFoundException } from '@nestjs/common';
import { Task, TaskStatus } from './task.model';
import { v4 as uuid } from 'uuid';
import { CreateTaskDto } from './Dto/creat-task.dto';
import { GetFiletrDto } from './Dto/filter-task.dto';

@Injectable()
export class TasksService {
    private task: Task[] = [];

    getAllTasks(): Task[] {
        return this.task;
    }

    getTaskWithFilters(filterDto: GetFiletrDto): Task[] {
        const {status, search} = filterDto;
        let tasks = this.getAllTasks();
        if(status) {
            tasks = this.task.filter(task => task.status === status)
        }
        if(search) {
            tasks = this.task.filter(task => {
                if(task.title.toLocaleLowerCase().includes(search) || task.description.includes(search)) {
                    return true;
                }
                return false;
            });
        }
        return tasks;
    }

    getTaskById(id: string): Task {
        let found = this.task.find(task => task.id === id);

        if(!found) {
            throw new NotFoundException(`Task with id ${id} not found`)
        }

        return found;
    }

    createTask(createTaskDto: CreateTaskDto): Task {
        const { title, description } = createTaskDto;
        const task: Task = {
            id: uuid(),
            title,
            description,
            status: TaskStatus.OPEN
        }

        this.task.push(task);
        return task;
    }

    deleteTaskById(id: string) {
        let found = this.getTaskById(id);
        const index = this.task.findIndex(task => task.id === found.id);
        this.task.splice(index)
        return `Deleted task with id ${id} successfully`;
    }

    updateTaskStatus(id: string, status: TaskStatus): Task {
        // const index = this.task.findIndex(task => task.id === id);

        // if (index === -1) {
        //     throw new NotFoundException(`Task with ID "${id}" not found`);
        // }

        // this.task[index] = {
        //     ...this.task[index],
        //     status,
        // };
        // return this.task[index];
        let task = this.getTaskById(id);
        task.status = status;
        return task;
    }
}
