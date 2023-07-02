import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = 'http://localhost:3000/products';

  constructor(private http: HttpClient) { }

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.apiUrl);
  }

  addProduct(product: Product, formData: FormData): Observable<any> {
    formData.append('nama', product.nama);
    formData.append('harga', product.harga.toString());
    formData.append('deskripsi', product.deskripsi);
    formData.append('gambar', product.gambar);
    return this.http.post(this.apiUrl, formData);
  }

  // updateProduct(product: Product): Observable<any> {
  //   const url = `${this.apiUrl}/${product.id}`;
  //   return this.http.put(url, product);
  // }
 
  updateProduct(product: Product, formData: FormData): Observable<any> {
    formData.append('nama', product.nama);
    formData.append('harga', product.harga.toString());
    formData.append('deskripsi', product.deskripsi);
    formData.append('gambar', product.gambar);
    const url = `${this.apiUrl}/${product.id}`;
    return this.http.put(url, formData);
  }
  
  deleteProduct(productId: number): Observable<any> {
    const url = `${this.apiUrl}/${productId}`;
    return this.http.delete(url);
  }
}
