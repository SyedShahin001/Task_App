import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router'; 
import { User } from '../../models/Users';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
       
})
export class LoginComponent implements OnInit {

  user: User = {
    id: 0,
    email: '',
    password: ''
  }
 
  errorMessage: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.authService.authState$.subscribe(isAuthenticated => {
      if (isAuthenticated) {      
        // console.log('User  is authenticated');
      } else {
        console.log('User  is not authenticated');
      }
    });
  }

  onLogin(): void {
    if (!this.user.email || !this.user.password) {
      this.errorMessage = 'Please fill in both email and password.';
      return; 
    }

    // Attempt to log in
    const userCredentials = localStorage.getItem('userCredentials');
    if (userCredentials) {
      const users = JSON.parse(userCredentials);
      const user = users.find((u: { email: string; password: string }) => 
        u.email === this.user.email && u.password === this.user.password
      );

      if (user) {
        // Store the user ID in local storage
        localStorage.setItem('loggedInUser  Id', user.id.toString());
        this.authService.login(this.user.email, this.user.password); // Call the login method from AuthService

        this.errorMessage = ''; 
        this.router.navigate(['/home'], { replaceUrl: true }); // Redirect to home on successful login
      } else {
        this.errorMessage = 'Invalid email or password. Please try again.';
      }
    } else {
      this.errorMessage = 'No user credentials found.';
    }
  }

  onLogout(): void {
    this.authService.logout();
    this.router.navigate(['/login']); 
  }
}