import { CollaboraterTask } from './CollaboraterTask';
import { Competence } from './Competence';

export interface User{
    id?: number,
    firstName: string,
    lastName: string,
    email: string,
    role: string,
    photoURL: string,
    password?: string,
    active?: boolean,
    competences?: Competence[],
    tasks?: CollaboraterTask[]
}