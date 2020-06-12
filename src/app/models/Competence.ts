import { Task } from './Task';
import { User } from './User';

export interface Competence{
    id?: number,
    name: string,
    tasks?: Task[],
    collaboraters?: User[]
}