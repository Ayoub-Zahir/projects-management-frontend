export interface Task{
    id: number,
    name: string,
    hourlyVolume: number,
    isComplete: boolean,
    startDate: Date,
    endDate: Date,
    description: string
}