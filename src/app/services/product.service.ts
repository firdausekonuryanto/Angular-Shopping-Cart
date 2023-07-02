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

  // addProduct(product: Product): Observable<any> {
  //   return this.http.post(this.apiUrl, product);
  // }
  addProduct(product: Product, formData: FormData): Observable<any> {
    return this.http.post(this.apiUrl, formData, { params: { ...product } });
  }

  
  

  // updateProduct(product: Product): Observable<any> {
  //   const url = `${this.apiUrl}/${product.id}`;
  //   return this.http.put(url, product);
  // }
 
  updateProduct(product: Product, formData: FormData): Observable<any> {
    const url = `${this.apiUrl}/${product.id}`;
    return this.http.put(url, formData, { params: { ...product } });
  }
  
  deleteProduct(productId: number): Observable<any> {
    const url = `${this.apiUrl}/${productId}`;
    return this.http.delete(url);
  }
}
