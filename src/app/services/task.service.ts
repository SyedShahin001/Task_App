import { Injectable } from '@angular/core';
import { Task } from '../models/Task';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private localStorageKey = 'tasks';

  constructor() { }

  // Get all tasks
  getTasks(): Task[] {
    const tasks = localStorage.getItem(this.localStorageKey);
    return tasks ? JSON.parse(tasks) as Task[] : [];
  }

  // Add a new task
  addTask(task: Task): void {
    const tasks = this.getTasks();
    
    // Automatically assign a unique ID
    task.taskid = this.generateUniqueId(tasks); 
    tasks.push(task); // Add the new task to the list
    localStorage.setItem(this.localStorageKey, JSON.stringify(tasks)); 
  }

  // Generate a unique ID
  private generateUniqueId(tasks: Task[]): number {
    if (tasks.length === 0) {
      return 1; // Start IDs from 1 if no tasks exist
    }
    const maxId = Math.max(...tasks.map(task => task.taskid)); 
    return maxId + 1; // Return the next ID
  }

  // Delete a task by ID
  deleteTask(taskId: number): void {
    let tasks = this.getTasks();
    tasks = tasks.filter(task => task.taskid !== taskId); 
    localStorage.setItem(this.localStorageKey, JSON.stringify(tasks));
  }

  // Edit a task
  editTask(updatedTask: Task): void {
    const tasks = this.getTasks();
    const taskIndex = tasks.findIndex(task => task.taskid === updatedTask.taskid); 
    if (taskIndex !== -1) {
      tasks[taskIndex] = updatedTask;
      localStorage.setItem(this.localStorageKey, JSON.stringify(tasks));
    }
  }


  findTaskById(id: number): Task | undefined {
    const tasks = this.getTasks();
    return tasks.find(task => task.taskid === id);
  }
}