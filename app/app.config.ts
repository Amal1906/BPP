import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideToastr } from 'ngx-toastr';
import { authInterceptor } from '../app/data/auth.interceptor';
import { appInterceptor } from './data/app.interceptor';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { routes } from './app.routes';
import { DatePipe } from '@angular/common';
import { provideClientHydration } from '@angular/platform-browser';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes), provideAnimations(),
     provideHttpClient(withInterceptors([appInterceptor])), 
    provideHttpClient(withInterceptors([authInterceptor])),
    provideToastr({
      positionClass: 'toast-top-right',
    }),
    DatePipe,
    	provideClientHydration()
  ]
};
