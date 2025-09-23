import { HttpInterceptorFn } from '@angular/common/http';
import { environment } from '../../environments/environment';

/**
 * HTTP interceptor that prepends the base API URL to all outgoing requests
 */
export const appInterceptor: HttpInterceptorFn = (req, next) => {

    /**
     * Clone the request and prepend the base URL from environment
     * @type {HttpRequest<any>}
     */
    const modifiedReq = req.clone({
      url : `${environment.baseUrl}${req.url}`
    })

    /**
     * Pass the cloned request to the next handler in the chain
     * @returns {Observable<HttpEvent<any>>}
     */
    return next(modifiedReq);
  };
