import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpErrorResponse } from '@angular/common/http'
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
    providedIn: 'root'
})
export class TokenInterceptorService implements HttpInterceptor {
    private AUTH_URL: string = `${environment.apiURL}/authenticate`;

    constructor(
        private router: Router,
        private authService: AuthService
    ) { }

    intercept(request: HttpRequest<any>, next: HttpHandler) {
        if (request.url !== this.AUTH_URL) {
            const addTokenToRequest = request.clone({
                setHeaders: {
                    Authorization: `Bearer ${this.authService.getToken()}`
                }
            });

            return next.handle(addTokenToRequest).pipe(
                catchError((error: HttpErrorResponse) => {
                    if(error.status === 403){
                        this.authService.removeToken();
                        this.router.navigate(['/login']);
                        console.error('403 forbidden unauthorized operation!!');
                    }
                    return throwError(error);
                })
            );
        }
        else {
            return next.handle(request).pipe(
                catchError((error: HttpErrorResponse) => {
                    return throwError(error);
                })
            );
        }

    }
}
