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
  constructor(private authService: AuthService, private router: Router) {}

  is_staffString: string | null = localStorage.getItem('is_staff');
  is_staff: boolean = this.is_staffString === 'true';
  username: string | null = localStorage.getItem('username');

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
    localStorage.removeItem('id_member');
    localStorage.removeItem('is_staff');
    this.router.navigate(['/home']); // Redirect ke halaman login
  }

  ngOnInit() {
    console.log('is staff : ' + this.is_staff);
  }
}
