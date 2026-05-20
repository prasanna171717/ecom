import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Payment } from '../../shared/models/payment.model';

@Injectable({
  providedIn: 'root',
})
export class PaymentService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/payments';

  processPayment(cardNumber:string, amount: number): Observable<{success: boolean; message:string}>{
    if(cardNumber && amount>0){
      return of({
        success: true,
        message:'Payment Successful'
      });
    }

    return of({
      success: false,
      message:'Payment Failed'
    });
  }
  createPayment(payment: Payment) {
    return this.http.post<Payment>(this.apiUrl, payment);
  }

  updatePayment(id: string, data: Partial<Payment>) {
    return this.http.patch<Payment>(
      `${this.apiUrl}/${id}`,
      data
    );
  }
}
