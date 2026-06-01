export class TaskExecutionLogModel {
    taskExecutionLogId!: number;
    taskId!: number;
    parameter!: string;
    taskDetails!: string;
    startDatetime!: Date;
    endDatetime!: Date;
    userName!: string;
}