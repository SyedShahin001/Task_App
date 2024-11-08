
export interface Task {
    taskid: number;
    title: string;
    description: string;
    startDate: Date;
    endDate: Date;
    status: string;
    userId: number; // Assuming tasks are associated with a user
  }