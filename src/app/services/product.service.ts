import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from '../models/product.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = 'http://localhost:3000/products';

  constructor(private http: HttpClient) { }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  getProducts(): Observable<Product[]> {
    const headers = this.getHeaders();
    return this.http.get<Product[]>(this.apiUrl, {headers});
  }

  getProductsHome(): Observable<Product[]> {
    const headers = this.getHeaders();
    return this.http.get<Product[]>('http://localhost:3000/products_home', {headers});
  }

  addProduct(product: Product, formData: FormData): Observable<any> {
    const headers = this.getHeaders();
    formData.append('nama', product.nama);
    formData.append('harga', product.harga.toString());
    formData.append('deskripsi', product.deskripsi);
    formData.append('gambar', product.gambar);
    return this.http.post(this.apiUrl, formData, {headers});
  }

  updateProduct(product: Product, formData: FormData): Observable<any> {
    const headers = this.getHeaders();
    formData.append('nama', product.nama);
    formData.append('harga', product.harga.toString());
    formData.append('deskripsi', product.deskripsi);
    formData.append('gambar', product.gambar);
    const url = `${this.apiUrl}/${product.id}`;
    return this.http.put(url, formData, {headers});
  }
  
  deleteProduct(productId: number): Observable<any> {
    const headers = this.getHeaders();
    const url = `${this.apiUrl}/${productId}`;
    return this.http.delete(url, {headers});
  }
}
