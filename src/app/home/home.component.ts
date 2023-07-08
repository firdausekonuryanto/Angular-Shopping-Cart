import { Component, OnInit } from '@angular/core';
import { ProductService } from '../services/product.service';
import { AuthService } from '../services/auth.service';

@Component({
selector: 'app-home',
templateUrl: './home.component.html',
styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  products: any[] = []; // Initialize the 'products' property with an empty array
  firstHalf: any[] = [];
  secondHalf: any[] = [];
  username: string = '';

constructor(private productService: ProductService, private authService: AuthService) {}

ngOnInit() {
  this.getProducts(); // Panggil metode untuk mengambil data produk saat komponen diinisialisasi
  this.username = localStorage.getItem('username')!;
  const username = localStorage.getItem('username');

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