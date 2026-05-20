import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { Product } from '../../shared/models/product.model';

@Injectable({
  providedIn: 'root',
})
export class ProductService {

  private http = inject(HttpClient);

  private apiUrl =`${environment.apiUrl}/products`;

  getProducts():Observable<Product[]>{
    return this.http.get<Product[]>(this.apiUrl)
  }
  getProductById(id:number):Observable<Product>{
    return this.http.get<Product>(`${this.apiUrl}/${id}`);
  }

  searchProducts(searchTerm: string) {
    return this.http.get<Product[]>(
      `${this.apiUrl}?name_like=${searchTerm}`
    );
  }

  filterByCategory(category: string) {
    return this.http.get<Product[]>(
      `${this.apiUrl}?category=${category}`
    );
  }

  addProduct(product:Product): Observable<Product>{
    return this.http.post<Product>(this.apiUrl, product);
  }

  updateProduct(product:Product):Observable<Product>{
    return this.http.put<Product>(`${this.apiUrl}/${product.id}`,product);
  }

  deleteProduct(id:number):Observable<void>{
    return this.http.delete<void>(`${this.apiUrl}/${id}`)
  }

}
