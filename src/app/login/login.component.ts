import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  error: string = '';
  logoutx:boolean = false;

  constructor(private authService: AuthService, private router: Router) { }

  login() {
    this.authService.login(this.username, this.password)
      .subscribe(
        (response) => {
          // Login successful
          console.log('Login successful');

          localStorage.setItem('token', response.token);
          localStorage.setItem('username', response.username);
          
          this.authService.setUsername(this.username); // Simpan username ke AuthService
          this.router.navigate(['/home']); // Redirect ke halaman products_home
        },
        (error) => {
          // Login failed
          console.error('Login failed:', error);
          this.error = 'Invalid username or password.';
        }
      );
  }
}
