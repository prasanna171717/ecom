import { CanActivateFn, Router } from "@angular/router";
import { inject } from "@angular/core";
import { Auth } from "../../features/auth/auth";

export const authGuard: CanActivateFn = () => {
    const router = inject(Router);
     const authService = inject(Auth);

     let token:string | null = null;

    if(authService.isAuthenticated()){
     return true;
    }


    return router.createUrlTree(['/auth/login']);
}