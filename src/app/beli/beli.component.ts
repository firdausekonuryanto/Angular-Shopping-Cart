import { Component, OnInit } from '@angular/core';
import { ProductService } from '../services/product.service';
import { AuthService } from '../services/auth.service';
import { TransactionsService } from '../services/transactions.service';
import { TransactionitemsService } from '../services/transactionitems.service';
import { Product } from '../models/product.model';

@Component({
  selector: 'app-beli',
  templateUrl: './beli.component.html',
  styleUrls: ['./beli.component.css'],
})
export class BeliComponent implements OnInit {
  products: Product[] = [];
  username: string = '';
  cartItems: Product[] = [];

  constructor(
    private productService: ProductService,
    private authService: AuthService,
    private transactionsService: TransactionsService,
    private transactionitemsService: TransactionitemsService
  ) {}

  openModal(product: Product): void {
    const modalImgElement = document.getElementById(
      'gambarModalImg'
    ) as HTMLImageElement | null;
    const modalElement = document.getElementById('gambarModal');
    const nm_product = document.getElementById('gambarModalLabel');
    if (modalImgElement && modalElement && nm_product) {
      modalImgElement.src = 'http://localhost:3000/uploads/' + product.gambar;
      nm_product.innerHTML = product.nama;
      modalElement.classList.add('show');
      modalElement.style.display = 'block';
      document.body.classList.add('modal-open');
    }
  }

  addToCart(product: Product): void {
    const cartItems = localStorage.getItem('cartItems'); // Mengambil data keranjang dari Local Storage
    let cart: Product[] = []; // Inisialisasi keranjang

    if (cartItems) {
      cart = JSON.parse(cartItems); // Parsing data keranjang yang telah disimpan
    }

    cart.push(product); // Menambahkan produk baru ke keranjang
    localStorage.setItem('cartItems', JSON.stringify(cart)); // Menyimpan keranjang ke Local Storage
    this.loadProducts();
    this.loadCartItems();
  }

  calculateSubtotal(item: Product): void {
    item.subtotal = item.harga * item.qty;
  }

  loadCartItems(): void {
    const cartItems = localStorage.getItem('cartItems');

    if (cartItems) {
      this.cartItems = JSON.parse(cartItems);
    }
  }

  removeFromCart(index: number): void {
    this.cartItems.splice(index, 1);
    localStorage.setItem('cartItems', JSON.stringify(this.cartItems));
  }

  closeModal(): void {
    const modalElement = document.getElementById('gambarModal');
    if (modalElement) {
      modalElement.classList.remove('show');
      modalElement.style.display = 'none';
      document.body.classList.remove('modal-open');
    }
  }

  saveBeli() {
    const currentDate = new Date();

    const dataTransactions = [
      {
        member: localStorage.getItem('id_member'),
        purchase_date: currentDate,
        total_amount: this.cartItems.reduce(
          (total, item) => total + item.harga * item.qty,
          0
        ),
      },
    ];

    this.transactionsService.saveData(dataTransactions).subscribe(
      (response) => {
        const transactionIds = response.insertedIds;
        const dataToSave = this.cartItems.map((item, index) => ({
          transaction: transactionIds[0],
          product: item.id.toString(),
          qty: item.qty,
          subtotal: item.harga * item.qty,
        }));

        this.transactionitemsService.saveData(dataToSave).subscribe(
          (response) => {
            console.log(response);
            localStorage.removeItem('cartItems');
            window.location.href = 'http://localhost:4200/history'; // Reload halaman ke URL history
          },
          (error) => {
            console.error(error);
          }
        );
      },
      (error) => {
        console.error(error);
      }
    );
  }

  ngOnInit() {
    this.loadProducts();
    this.loadCartItems();
  }

  loadProducts() {
    this.productService.getProducts().subscribe((products) => {
      this.products = products;
    });
  }
}
