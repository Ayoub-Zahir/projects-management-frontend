import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

// Models
import { User } from 'src/app/models/User';
import { map } from 'rxjs/operators';

const headers: HttpHeaders = new HttpHeaders({'Content-type':'application/json; charset=UTF-8'});

@Injectable({
    providedIn: 'root'
})
export class UserService {

    private URL: string = `${environment.apiURL}`;

    constructor(private http: HttpClient) { }

    getCollaboraters(pageNumber: number , rowsNumber: number): Observable<any>{
        const params: HttpParams = new HttpParams()
            .set('page', pageNumber.toString())
            .set('rows', rowsNumber.toString());
        
        return this.http.get<any>(`${this.URL}/users/collaboraters`, { headers , params });
    }

    getManagers(pageNumber: number , rowsNumber: number): Observable<any>{
        const params: HttpParams = new HttpParams()
            .set('page', pageNumber.toString())
            .set('rows', rowsNumber.toString());
        
        return this.http.get<any>(`${this.URL}/admin/users/managers`, { headers , params });
    }

    add(collaborater: User): Observable<User>{
        return this.http.post<User>(`${this.URL}/admin/users`, collaborater, { headers });
    }

    update(updatedUser: User): Observable<User>{
        return this.http.put<User>(`${this.URL}/admin/users/${updatedUser.id}`, updatedUser, { headers });
    }

    delete(id: string): Observable<void>{
        return this.http.delete<void>(`${this.URL}/admin/users/${id}`, { headers });
    }

    searchCollabboraters(keyword: string): Observable<User[]>{
        const params: HttpParams = new HttpParams().set('keyword', keyword);
        
        return this.http.get<User[]>(`${this.URL}/manager/users/collaboraters/search`, { headers , params });
    }
}
