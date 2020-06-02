import { Collaborater } from './Collaborater';
import { Task } from './Task';

export interface CollaboraterTask{
    id?: {
        collaboraterId: number,
        taskId: number
    },
    workingHours: number,
    collaborater?: Collaborater,
    task?: Task
}