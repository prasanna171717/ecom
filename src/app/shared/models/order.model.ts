import { CartItem } from './cart-item.model';

export interface Order {
  id?: string;
  userId: string;
  items: CartItem[];
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered';
  paymentStatus: 'pending' | 'success' | 'failed';

  createdAt: string;
}
