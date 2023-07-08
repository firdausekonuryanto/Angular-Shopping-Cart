import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';



@Component({
  selector: 'app-template',
  templateUrl: './template.component.html',
  styleUrls: ['./template.component.css'],
})

export class TemplateComponent {
  constructor(private authService: AuthService, private router: Router) { }
  
  isTokenAvailable(): boolean {
    const token = localStorage.getItem('token');
    return !!token; // Mengembalikan true jika token ada, false jika tidak ada
  }

  isLogin(): boolean {
    const token = localStorage.getItem('token');
    return !!token; // Mengembalikan true jika token ada, false jika tidak ada
  }

  logout() {
    this.authService.logout(); // Panggil fungsi logout dari AuthService
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    this.router.navigate(['/home']); // Redirect ke halaman login
  }
}

