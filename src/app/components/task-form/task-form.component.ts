import { Component, OnInit } from '@angular/core';
import { TaskService } from '../../services/task.service';
import { Task } from '../../models/Task';
import { Router } from '@angular/router';

@Component({
  selector: 'app-task-form',
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.css'],
  
})
  
export class TaskFormComponent implements OnInit {
  task: Task = {
    taskid: 0,
    title: '',
    description: '',
    startDate: new Date(),
    endDate: new Date(),
    status: 'Pending',
    userId: 1 
  };

  constructor(private taskService: TaskService, private router: Router) {}

  ngOnInit(): void {
    // Retrieve the logged-in user ID from local storage
    const loggedInUserId = localStorage.getItem('loggedInUser  Id');

    if (loggedInUserId) {
      this.task.userId = parseInt(loggedInUserId, 10); // Set userId from the logged-in user ID
    }
  }

  onSubmit(): void {
    this.taskService.addTask(this.task);
    this.router.navigate(['/tasklist']); 
  }
}