
import { Routes } from '@angular/router';
import { Login } from './login/login';
import { authGuard } from '../../core/guards/auth.guard';

export const Auth_Routes: Routes = [
    {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
    },
    {
        path: 'login',
        loadComponent: () =>
            import('./login/login').then(m => m.Login)
    },

    {
        path: 'register',
        loadComponent: () =>
            import('./register/register').then(m => m.Register)
    },

    {
        path: 'profile',
        canActivate: [authGuard],
        loadComponent: () =>
            import('./profile/profile').then(m => m.Profile)
    }

]