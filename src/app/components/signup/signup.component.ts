import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/Users'; 

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  user: User = { id: 0,  email: '', password: '' }; 

  constructor(private authService: AuthService) {}

  onSignup(): void {
    if (this.user.email && this.user.password) {
      this.authService.signup(this.user.email, this.user.password);
      alert('Sign up successful!'); 
    } else {
      alert('Please fill in all fields.'); 
    }
  }
}