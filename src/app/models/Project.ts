import { Task } from 'src/app/models/Task';

export interface Project{
    id?: number,
    name?: string,
    hourlyVolume?: number,
    description?: string,
    startDate?: Date | string,
    endDate?: Date,
    tasks?: Task [],
    progress?: number,
    daysLeft?: number,
    completedTasks?: number
}