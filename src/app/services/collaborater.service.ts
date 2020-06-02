import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

// Models
import { Collaborater } from 'src/app/models/Collaborater';
import { map } from 'rxjs/operators';

const headers: HttpHeaders = new HttpHeaders({'Content-type':'application/json; charset=UTF-8'});

@Injectable({
    providedIn: 'root'
})
export class CollaboraterService {

    private URL: string = `${environment.apiURL}/collaboraters`;

    constructor(private http: HttpClient) { }

    getCollaboraters(pageNumber: number , rowsNumber: number): Observable<any>{
        const params: HttpParams = new HttpParams()
            .set('page', pageNumber.toString())
            .set('rows', rowsNumber.toString());
        
        return this.http.get<any>(this.URL, { headers , params });
    }

    add(collaborater: Collaborater): Observable<Collaborater>{
        return this.http.post<Collaborater>(this.URL, collaborater, { headers });
    }

    get(id: string): Observable<Collaborater>{
        return this.http.get<Collaborater>(`${this.URL}/${id}`, { headers });
    }

    update(updatedCollaborater: Collaborater): Observable<Collaborater>{
        return this.http.put<Collaborater>(`${this.URL}/${updatedCollaborater.id}`, updatedCollaborater, { headers });
    }

    delete(id: string): Observable<void>{
        return this.http.delete<void>(`${this.URL}/${id}`, { headers });
    }

    search(keyword: string): Observable<Collaborater[]>{
        const params: HttpParams = new HttpParams().set('keyword', keyword);
        
        return this.http.get<Collaborater[]>(`${this.URL}/search`, { headers , params })
            .pipe(map(collaboraters => collaboraters.map(collaborater => {
                return {
                    id: collaborater.id,
                    firstName: collaborater.firstName,
                    lastName: collaborater.lastName,
                    email: collaborater.email,
                    photoURL: collaborater.photoURL,
                    competences: collaborater.competences,
                    tasks: collaborater.tasks
                };
            })));
    }
}
