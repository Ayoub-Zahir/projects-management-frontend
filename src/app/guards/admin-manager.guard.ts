import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Injectable({
    providedIn: 'root'
})
export class AdminManagerGuard implements CanActivate {

    constructor(
        private authService: AuthService,
        private router: Router
    ) {
    }
    
    canActivate(): Promise<boolean> {
        return new Promise((resolve, reject) => {
            this.authService.getCurrentAuthUser().subscribe(user => {
                if (user.role === 'ROLE_ADMIN' || user.role === 'ROLE_MANAGER') {
                    resolve(true);
                } else {
                    this.router.navigate(['/projects']);
                    reject(false);
                }
            });
        });
    }
}
