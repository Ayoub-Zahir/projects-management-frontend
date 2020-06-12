import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/User';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

const headers: HttpHeaders = new HttpHeaders({'Content-type':'application/json; charset=UTF-8'});

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private URL: string = `${environment.apiURL}`;

    constructor(private http: HttpClient, private router: Router) { }

    login({ email, password }): Observable<any>{
        return this.http.post<any>(`${this.URL}/authenticate`, { email, password }, { headers });
    }

    logout(){
        this.removeToken();
        this.router.navigate(['/login']);
    }

    getCurrentAuthUser(): Observable<User>{
        return this.http.get<User>(`${this.URL}/currentAuthUser`, { headers })
            .pipe(map(user => {
                return {
                    id: user.id,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    role: user.role,
                    active: user.active,
                    photoURL: user.photoURL,
                    tasks: user.tasks
                };
            }));
    }

    isUserLogin(): boolean{
        return !!localStorage.getItem('token');
    }

    removeToken(): void{
        localStorage.removeItem('token');
    }
    
    getToken(): string{
        return localStorage.getItem('token');
    }
}
