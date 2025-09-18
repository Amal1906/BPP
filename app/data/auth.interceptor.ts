import { HttpHandlerFn, HttpInterceptorFn, HttpRequest, HttpEvent } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ModalComponent } from '../shared/modal/modal.component';
import { CommonService } from '../shared/service/common/common.service';

export const authInterceptor: HttpInterceptorFn = (req: HttpRequest<any>, next: HttpHandlerFn): Observable<HttpEvent<any>> => {
  let token: string | null = null;
  const router = inject(Router);
  const dialog = inject(MatDialog);
  const modalStateService = inject(CommonService); 

  if (typeof window !== 'undefined') {
    token = localStorage.getItem('bearer_token');  // Safely access localStorage
  }
   if (req.url.includes('/login')) {
      return next(req);
    }
     /**
   * Clone the request and add authorization header if token exists
   * @type {HttpRequest<any>}
   */
    const clonedRequest = token
    ? req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      })
    : req;

    return next(clonedRequest).pipe(
      catchError((error) => {
        if (error.status == 401 && !modalStateService.getModalState()) { // if status code get 401
          modalStateService.setModalState(true);
          // Open the modal for error message
          const ref: MatDialogRef<ModalComponent> = dialog.open(ModalComponent, {
            hasBackdrop: true,
            data: {
              modalTitle: 'Session Timeout',
              modalBody: 'Your session has expired. Please log in again.',
              modalName: 'session_expired'
            }
          });
          // Handle modal close to redirect to login page
          ref.afterClosed().subscribe((result: any) => {
            modalStateService.setModalState(false);
            localStorage.clear()
            router.navigate(['/login']);
          });
        }
        return throwError(() => error); // Continue to throw the error
      })
    );
  }