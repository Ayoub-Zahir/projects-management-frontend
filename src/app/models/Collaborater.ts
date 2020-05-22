import { Competence } from './Competence';
import { Task } from './Task';

export interface Collaborater{
    id?: number,
    firstName: string,
    lastName: string,
    email: string,
    photoURL: string,
    competences?: Competence[],
    tasks?: Task[]
}