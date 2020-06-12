import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

    email: string = '';
    password: string = '';
    loading: boolean = false;

    constructor(
        private authService: AuthService,
        private router: Router
    ) { }

    ngOnInit(): void {
        if (this.authService.isUserLogin()) {
            this.router.navigate(['/projects']);
        }
    }

    onLogin(form) {
        // Form valid processing ...
        if (form.valid) {

            // Display spinner
            this.loading = true;

            // Login from the Firebase authentication service
            this.authService.login({ email: form.value.email, password: form.value.password })
                .subscribe(
                    (response) => {
                        // Add the token in localStorage for next requests
                        localStorage.setItem('token', response.jwt);

                        this.router.navigate(['/projects'])
                            .then(() => {
                                // Success login
                                Swal.fire({
                                    position: 'top-end',
                                    icon: 'success',
                                    title: 'Welcome Back !!',
                                    showConfirmButton: false,
                                    timer: 2000
                                })
                            });

                    },
                    () => {
                        this.loading = false;
                        form.controls.email.setErrors({ 'badCredentials': true });
                        form.controls.password.setErrors({ 'badCredentials': true });
                            
                    }
                );
        }
        else {
            // Error form invalid
            form.form.markAllAsTouched();
        }
    }

}
