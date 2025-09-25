import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

/**
 * Route guard that checks if user is logged in
 * @param route - Current route information
 * @param state - Current router state
 * @returns True if allowed, false if not (redirects to login)
 */
export const authGuard: CanActivateFn = (route, state) => {
    
    const router = inject(Router)

    if(typeof route === 'undefined'){
        router.navigate(['/login']);
        return false;
    }
    // Check for user token in storage
    const token = localStorage.getItem('email');
    

    if(!token || token === undefined){
        router.navigate(['/login']);
        return false;
    } else {
        return true;
    }
};
