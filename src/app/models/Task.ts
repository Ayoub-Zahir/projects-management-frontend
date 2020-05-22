
export interface Task{
    id?: number,
    name: string,
    hourlyVolume: number,
    isComplete: boolean,
    startDate: Date | string,
    endDate: Date,
    description: string,
    project?: {id: number}
}