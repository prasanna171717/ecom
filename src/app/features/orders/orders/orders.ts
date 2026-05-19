import { Component, inject, OnInit, signal } from '@angular/core';
import { OrderService } from '../order-service';
import { Auth } from '../../auth/auth';
import { Order } from '../../../shared/models/order.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-orders',
  imports: [CommonModule],
  templateUrl: './orders.html',
  styleUrl: './orders.scss',
})
export class Orders implements OnInit {
  private orderService = inject(OrderService);
  private authService = inject(Auth);


  orders = signal<Order[]>([]);
  loading = signal(false);

  ngOnInit(): void {
    const user = this.authService.currentUser();
    
    if (!user) return;

    this.loading.set(true);

    if(user){
      this.orderService.getOrdersByUser(user.id).subscribe({
        next:(orders) => {
          this.orders.set(orders)
          this.loading.set(false);
      
      
        },
        error: () => {
        this.loading.set(false);
      }
      });
    }

  }



  
}

