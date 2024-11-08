import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { User } from '../models/Users';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private authStateSubject: BehaviorSubject<boolean>;
  public authState$: Observable<boolean>;

  constructor(private router: Router) {
    const token = this.getToken();
    this.authStateSubject = new BehaviorSubject<boolean>(!!token);
    this.authState$ = this.authStateSubject.asObservable();
  }

  private getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  private getUserCredentials(): User[] {
    const userCredentials = localStorage.getItem('userCredentials');
    return userCredentials ? JSON.parse(userCredentials) : [];
  }

  private getNextId(): number {
    const currentId = localStorage.getItem('userIdCounter');
    const nextId = currentId ? parseInt(currentId) + 1 : 1; 
    localStorage.setItem('userIdCounter', nextId.toString()); 
    return nextId;
  }

  signup(email: string, password: string): void {
    if (typeof localStorage !== 'undefined') {
      try {
        const existingCredentials = this.getUserCredentials();
        
        // Check if the user already exists
        const userExists = existingCredentials.some(user => user.email === email);
        if (userExists) {
          console.error('User  already exists. Please log in instead.');
          return; 
        }

        // Create new user credentials with a unique ID
        const userCredentials: User = { id: this.getNextId(), email, password };
        existingCredentials.push(userCredentials);
        localStorage.setItem('userCredentials', JSON.stringify(existingCredentials));
        console.log('User  credentials stored in localStorage');
      } catch (error) {
        console.error('Error storing user credentials in localStorage', error);
      }
    }
  }

  login(email: string, password: string): void {
    const storedCredentials = this.getUserCredentials();

    // Check if any user matches the provided email and password
    const user = storedCredentials.find(user => user.email === email && user.password === password);

    if (!user) {
      console.error('Invalid email or password');
      this.authStateSubject.next(false); 
      return;
    }

    const token = 'fake-jwt-token'; 
    localStorage.setItem('authToken', token);
    this.authStateSubject.next(true);
    console.log('User  logged in');
  }

  logout(): void {
    localStorage.removeItem('authToken'); 
    this.authStateSubject.next(false); 
    console.log('User  logged out');
  }

  isAuthenticated(): boolean {
    return this.authStateSubject.value;
  }
}