import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';

// Models
import { Competence } from 'src/app/models/Competence';

// Rxjs
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

const headers: HttpHeaders = new HttpHeaders({'Content-type':'application/json; charset=UTF-8'});

@Injectable({
    providedIn: 'root'
})
export class CompetenceService {

    private URL: string = `${environment.apiURL}/manager/competences`;

    constructor(private http: HttpClient) { }

    getCompetences(pageNumber: number , rowsNumber: number): Observable<any>{
        const params: HttpParams = new HttpParams()
            .set('page', pageNumber.toString())
            .set('rows', rowsNumber.toString());
        
        return this.http.get<any>(this.URL, { headers , params });
    }

    add(competence: Competence): Observable<Competence>{
        return this.http.post<Competence>(this.URL, competence, { headers });
    }

    update(updatedCompetence: Competence): Observable<Competence>{
        return this.http.put<Competence>(`${this.URL}/${updatedCompetence.id}`, updatedCompetence, { headers });
    }

    delete(id: string): Observable<void>{
        return this.http.delete<void>(`${this.URL}/${id}`, { headers });
    }

    search(keyword: string): Observable<Competence[]>{
        const params: HttpParams = new HttpParams().set('keyword', keyword);
        
        return this.http.get<Competence[]>(`${this.URL}/search`, { headers , params })
            .pipe(map(competences => competences.map(competence => {
                return {
                    id: competence.id,
                    name:  competence.name
                };
            })));
    }
}
