import { Component, OnInit } from '@angular/core';
import { ProductService } from '../services/product.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  products: any[] = [];
  firstHalf: any[] = [];
  secondHalf: any[] = [];
  username: string = '';

  constructor(
    private productService: ProductService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.getProducts();
    this.username = localStorage.getItem('username')!;
    const data_member_login =
      localStorage.getItem('username') +
      ' - ' +
      localStorage.getItem('id_member')! +
      ' - ' +
      localStorage.getItem('is_staff')!;

    console.log(data_member_login);
  }

  getProducts() {
    this.productService.getProductsHome().subscribe(
      (data: any) => {
        this.firstHalf = data.firstHalf;
        this.secondHalf = data.secondHalf;
      },
      (error) => {
        console.error('Terjadi kesalahan:', error);
      }
    );
  }
}
