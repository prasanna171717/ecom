import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard'


export const routes: Routes = [
    {
        path: 'products', loadChildren: () =>
            import('./features/product/product.routes').then(m => m.Product_Routes)
    },

    { path: '', redirectTo: 'prodcuts', pathMatch: 'full' },

    // {
    //     path: 'payment',
    //     // canActivate: [authGuard], 
    //     loadChildren: () =>
    //         import('./features/payment/payment.routes').then(m => m.Payment_Routes)
    // },

    {
        path: 'auth', loadChildren: () =>
            import('./features/auth/auth.routes').then(m => m.Auth_Routes)
    },

    {
        path: 'cart',
        canActivate: [authGuard],
        loadChildren: () =>
            import('./features/cart/cart.routes').then(m => m.Cart_Routes)
    },
    {
        path: 'orders',
        loadComponent: () => import('./features/orders/orders/orders').then(m => m.Orders)
    },
    {
        path: 'payment/:id',
        canActivate: [authGuard],
        loadComponent: () => import('./features/payment/payment/payment').then(m => m.Payment)
    },
    {
        path: '',
        redirectTo: 'products',
        pathMatch: 'full'
    },
    {
        path: '**',
        redirectTo: 'products'
    }



];
