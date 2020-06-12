import { Task } from './Task';
import { User } from './User';

export interface CollaboraterTask{
    id?: {
        collaboraterId: number,
        taskId: number
    },
    workingHours: number,
    collaborater?: User,
    task?: Task
}