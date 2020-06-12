import { Project } from './Project';
import { Collaborater } from './Collaborater';
import { Competence } from './Competence';
import { CollaboraterTask } from './CollaboraterTask';

export interface Task {
    id?: number,
    name: string,
    hourlyVolume: number,
    isComplete: boolean,
    startDate: Date | string,
    endDate: Date,
    description: string,
    project?: Project,
    collaboraters?: CollaboraterTask[],
    competences?: Competence[]
}