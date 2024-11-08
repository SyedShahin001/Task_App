import { Component, OnInit } from '@angular/core';
import { TaskService } from '../../services/task.service';
import { Task } from '../../models/Task';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { PageEvent } from '@angular/material/paginator';
import { MatSelectChange } from '@angular/material/select';
import { Router } from '@angular/router';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css'],
 
})
  
export class TaskListComponent implements OnInit {
  tasks: Task[] = [];
  paginatedTasks: Task[] = [];
  searchTerm: string = '';
  pageSize: number = 5;
  currentPage: number = 1;
  totalPages: number = 0;
  pageSizes: number[] = [5, 10, 20, 25];
  selectedStatus: string = '';
  private searchSubject: Subject<string> = new Subject<string>();
  loggedInUserId: number | null = null; 

  constructor(private taskService: TaskService, private router: Router) {}

  ngOnInit(): void {
    this.loadLoggedInUserId(); 
    this.loadTasks();
    this.setupSearch();
  }

  loadLoggedInUserId(): void {
    const userId = localStorage.getItem('loggedInUser  Id');
    this.loggedInUserId = userId ? parseInt(userId, 10) : null;
  }

  loadTasks(): void {
    this.tasks = this.taskService.getTasks();
    this.updatePagination();
  }

  updatePagination(): void {
    const filteredTasks = this.filterTasks();
    this.totalPages = Math.ceil(filteredTasks.length / this.pageSize);
    this.paginatedTasks = filteredTasks.slice((this.currentPage - 1) * this.pageSize, this.currentPage * this.pageSize);
  }

  filterTasks(): Task[] {
    return this.tasks.filter(task => 
      task.userId === this.loggedInUserId && // Filter by logged-in user ID
      task.title.toLowerCase().includes(this.searchTerm.toLowerCase()) &&
      (this.selectedStatus ? task.status === this.selectedStatus : true) 
    );
  }

  onSearch(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchSubject.next(input.value);
  }

  setupSearch(): void {
    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(term => {
      this.searchTerm = term;
      this.currentPage = 1; 
      this.updatePagination();
    });
  }

  changePage(event: PageEvent): void {
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex + 1; 
    this.updatePagination();
  }

  onStatusChange(event: MatSelectChange): void {
    this.selectedStatus = event.value; 
    this.currentPage = 1; 
    this.updatePagination(); 
  }

  toggleStatus(task: Task): void {
    task.status = task.status === 'Pending' ? 'Completed' : 'Pending';
    this.taskService.editTask(task);
    this.updatePagination(); 
  }

  deleteTask(taskId: number): void {
    this.taskService.deleteTask(taskId);
    this.loadTasks(); 
  }

  navigateToAddTask(): void {
    console.log("navigate to add task");
    this.router.navigate(['/taskform']);
  }
}