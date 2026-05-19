import {  Inject, Injectable, PLATFORM_ID, signal } from '@angular/core';
import { Product } from '../../shared/models/product.model';
import { CartItem } from '../../shared/models/cart-item.model';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class CartService {

  cartItems = signal<CartItem[]>(this.getCartFromStorage());
  constructor( @Inject(PLATFORM_ID) private platformId: Object){}


  private getCartFromStorage(): CartItem[] {
    let cart
       if(isPlatformBrowser(this.platformId)){
     cart= localStorage.getItem('cart');
       }
       
    return cart? JSON.parse(cart):[];
       
  }

  private saveCart(cart:CartItem[]){
           if(isPlatformBrowser(this.platformId)){
    localStorage.setItem('cart', JSON.stringify(cart));
           }
    this.cartItems.set(cart);
  }
  
addtoCart(product:Product){
  const cart=[...this.cartItems()];
  const existingProduct = cart.find(item=> item.id === product.id);
  if(existingProduct){
    existingProduct.quantity +=1;
  }else{
    cart.push({...product,quantity:1});
  }
  this.saveCart(cart)
}

removeFromCart(productId:string){
 const updatedCart = this.cartItems().filter(
  item => item.id !== productId
 )
 this.saveCart(updatedCart);
}

clearCart(){
  this.saveCart([]);
}
getTotalItems(){
  return this.cartItems().reduce((total,item) => total +item.quantity, 0)
}
getTotalPrice(){
  return this.cartItems().reduce((total, item) => total + item.price * item.quantity,0)
}

increaseQty(productId: string) {
  const cart = [...this.cartItems()];

  const item = cart.find(i => i.id === productId);

  if (item) {
    item.quantity += 1;
  }

  this.saveCart(cart);
}
decreaseQty(productId: string) {
  let cart = [...this.cartItems()];

  const item = cart.find(i => i.id === productId);

  if (!item) return
  if (item.quantity >1) {
  item.quantity -= 1;
  }else{
    cart= cart.filter(i =>i.id !== productId)
  }

  this.saveCart(cart);
}
}
