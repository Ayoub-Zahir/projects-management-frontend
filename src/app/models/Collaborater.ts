import { Competence } from './Competence';
import { CollaboraterTask } from './CollaboraterTask';

export interface Collaborater{
    id?: number,
    firstName: string,
    lastName: string,
    email: string,
    photoURL: string,
    competences?: Competence[],
    tasks?: CollaboraterTask[]
}