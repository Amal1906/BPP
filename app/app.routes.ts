import { Routes } from '@angular/router';
import { authGuard } from '../app/guard/auth.guard';

export const routes: Routes = [
    {
        path :'login',
        loadChildren: () => import('../app/auth/auth.module').then(m => m.AuthModule)
    },
    { 
        path: '', 
        redirectTo:'layout', 
        pathMatch:'full'
    },
    {
        path: 'layout', canActivate: [authGuard],
        loadChildren: () => import('../app/layout/layout.module').then(m => m.LayoutModule)
    },
];
