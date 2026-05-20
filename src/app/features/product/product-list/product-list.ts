import { Component, inject, signal } from '@angular/core';
import { ProductService } from '../productService';
import { CartService } from '../../cart/cartService';


import {MatCardModule} from '@angular/material/card';

import {MatButtonModule} from '@angular/material/button';
import { Product } from '../../../shared/models/product.model';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Auth } from '../../auth/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-product-list',
  imports: [MatCardModule,MatButtonModule,MatInputModule,MatFormFieldModule],
  templateUrl: './product-list.html',
  styleUrl: './product-list.scss',
})
export class ProductList {

  private productService = inject(ProductService);
  private cartService = inject(CartService)
  public authService = inject(Auth)
  private router = inject(Router)

  products = signal<any[]>([]);
  loading = signal(true);

  constructor(){
    this.productService.getProducts().subscribe((data: any[]) => {
      this.products.set(data);
      this.loading.set(false);
    })
  }

  addToCart(product:any){

    if(!this.authService.isAuthenticated()){
      alert("Please login to add items to cart");
      this.router.navigate(['/auth/login']);
      return;
    }
    this.cartService.addtoCart(product);
    alert(`${product.name} added to cart`)
  }

   filteredProducts = signal<Product[]>([]);
  searchTerm = signal('');

  ngOnInit() {
   this.loadProducts();
  }

  loadProducts() {
   this.productService.getProducts().subscribe({
    next: (products) => {
     this.products.set(products);
     this.filteredProducts.set(products);
    }
   });
  }

  search(event: Event) {
   const value = (event.target as HTMLInputElement).value.toLowerCase();

   this.searchTerm.set(value);

   const filtered = this.products().filter(product =>
    product.name.toLowerCase().includes(value) ||
    product.category.toLowerCase().includes(value)
   );

   this.filteredProducts.set(filtered);
  }

}
