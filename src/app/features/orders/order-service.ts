import { inject, Injectable } from '@angular/core';
import { Order } from '../../shared/models/order.model';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  
  private http = inject(HttpClient);

  private apiUrl = 'http://localhost:3000/orders';

  createOrder(order: Order) {
    return this.http.post<Order>(this.apiUrl, order);
  }

  getOrdersByUser(userId: string) {
    return this.http.get<Order[]>(
      `${this.apiUrl}?userId=${userId.toString()}`
    );
  }


  updateOrder(id: string, data: Partial<Order>) {
    return this.http.patch<Order>(
      `${this.apiUrl}/${id}`,
      data
    );
  }

  getOrderById(id: string) {
    return this.http.get<Order>(`${this.apiUrl}/${id}`);
  }
}
