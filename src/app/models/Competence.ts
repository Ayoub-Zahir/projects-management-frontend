import { Task } from './Task';
import { Collaborater } from './Collaborater';

export interface Competence{
    id?: number,
    name: string,
    tasks?: Task[],
    collaboraters?: Collaborater[]
}