import { Component, inject, signal } from '@angular/core';
import { PaymentService } from '../payment-service';
import { CartService } from '../../cart/cartService';
import { OrderService } from '../../orders/order-service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-payment',
  imports: [ReactiveFormsModule,MatFormFieldModule,MatInputModule,MatButtonModule,CommonModule],
  standalone: true,
  templateUrl: './payment.html',
  styleUrl: './payment.scss',
})
export class Payment {
paymentService = inject(PaymentService)
  cartService = inject(CartService)
  orderService = inject(OrderService);
  private route = inject(ActivatedRoute);
  private fb = inject(FormBuilder)
  
  private router = inject(Router)
  orderId!: string;
  loading = signal(false);
  error= signal('');

paymentForm = this.fb.group({
  cardNumber: ['', [
    Validators.required,
    Validators.pattern(/^\d{16}$/)
  ]],
  expiry: ['', [
    Validators.required,
    Validators.pattern(/^(0[1-9]|1[0-2])\/\d{2}$/)
  ]],
  cvv: ['', [
    Validators.required,
    Validators.pattern(/^\d{3}$/)
  ]]
});
ngOnInit(){
  this.orderId = this.route.snapshot.paramMap.get('id')!;

}

pay() {
  if(this.paymentForm.invalid){
    this.error.set('Please fill all the fields correctly');
    return;
  }
  this.loading.set(true);
  this.error.set('');
  const {cardNumber} = this.paymentForm.value;

  // simulate payment processing
  const payment = {
    orderId: this.orderId,
    amount: 1000, // replace dynamically
    method: 'card' as const,
    status: 'pending'as const,
    cardLast4: cardNumber?.slice(-4),
    createdAt: new Date().toISOString()
  };

  

  this.paymentService.createPayment(payment).pipe(finalize(() => this.loading.set(false))).subscribe({
    next: (res) => {

      // simulate gateway success
      setTimeout(() => {

        this.paymentService.updatePayment(res.id!, {
          status: 'success'
        }).subscribe(() => {

          this.orderService.updateOrder(this.orderId, {
            paymentStatus: 'success',
            status: 'confirmed'
          }).subscribe(() => {

            this.cartService.clearCart();

            alert('✅ Payment Successful! Order placed');

            this.router.navigate(['/orders']);
          });

        });

      }, 1500);
    }
  });
}
validateCard(cardNumber: string, expiry: string, cvv: string): string | null {

  // Card Number (16 digits)
  if (!/^\d{16}$/.test(cardNumber)) {
    return 'Invalid card number';
  }

  // Expiry MM/YY
  if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(expiry)) {
    return 'Invalid expiry format';
  }

  // CVV
  if (!/^\d{3}$/.test(cvv)) {
    return 'Invalid CVV';
  }

  return null;
}

}
