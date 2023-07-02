import { Component, OnInit } from '@angular/core';
import { ProductService } from '../services/product.service';
import { Product } from '../models/product.model';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {
  products: Product[] = [];
  product: Product | null = null;
  isNewProduct: boolean = true;
  selectedFile: File | null = null;


  constructor(private productService: ProductService) { }

  ngOnInit() {
    this.loadProducts();
    this.product = new Product();
  }

  loadProducts() {
    this.productService.getProducts().subscribe(products => {
      this.products = products;
    });
  }

  saveProduct() {
    if (this.isNewProduct && this.product) {
      this.product.gambar = this.selectedFile?.name || '';
  
      const formData = new FormData();
      formData.append('gambar', this.selectedFile as Blob);
  
      this.productService.addProduct(this.product, formData).subscribe(() => {
        this.resetForm();
        this.loadProducts();
      });
    } else if (!this.isNewProduct && this.product) {
      this.product.gambar = this.selectedFile?.name || '';
  
      const formData = new FormData();
      formData.append('gambar', this.selectedFile as Blob);
  
      this.productService.updateProduct(this.product, formData).subscribe(() => {
        this.resetForm();
        this.loadProducts();
      });
    }
  }
  

  editProduct(product: Product) {
    this.product = { ...product };
    this.isNewProduct = false;
  }

  deleteProduct(product: Product) {
    this.productService.deleteProduct(product.id).subscribe(() => {
      this.loadProducts();
    });
  }

  resetForm() {
    this.product = new Product();
    this.isNewProduct = true;
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }
}
