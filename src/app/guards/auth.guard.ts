import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate {

    constructor(
        private authService: AuthService,
        private router: Router
    ) { }

    canActivate(): Promise<boolean> {
        return new Promise((resolve, reject) => {
            if (this.authService.isUserLogin()) {
                resolve(true);
            } else {
                this.router.navigate(['/login']);
                reject(false);
            }
        });
    }
}
