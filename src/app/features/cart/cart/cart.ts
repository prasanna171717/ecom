import { Component, inject } from '@angular/core';
import { CartService } from '../cartService';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { Auth } from '../../auth/auth';
import { Router } from '@angular/router';
import { OrderService } from '../../orders/order-service';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-cart',
  imports: [CommonModule,MatButtonModule, MatCardModule],
  templateUrl: './cart.html',
  styleUrl: './cart.scss',
})
export class Cart {
  cartService = inject(CartService)
  private authService = inject(Auth);
  orderService = inject(OrderService);
  private router = inject(Router)
  checkout() {
  const user = this.authService.currentUser();

  if (!user) {
    alert('Please login to continue');
    this.router.navigate(['/auth/login']);
    return;
  }

  if (this.cartService.cartItems().length === 0) {
    alert('Cart is empty');
    return;
  }

  const order = {
    userId: user.id.toString(),
    items: this.cartService.cartItems(),
    totalAmount: this.cartService.getTotalPrice(),
    status: 'pending' as const,
    paymentStatus: 'pending' as const,
    createdAt: new Date().toISOString()
  };

  this.orderService.createOrder(order).subscribe({
    next: (res) => {
      this.router.navigate(['/payment', res.id]);
    }
  });
}
}
