import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpRequest } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Project } from 'src/app/models/Project';
import { Observable } from 'rxjs';

const httpOptions = {
    headers: new HttpHeaders({'Content-type':'application/json; charset=UTF-8'})
}

@Injectable({
    providedIn: 'root'
})
export class ProjectService {

    private URL: string = `${environment.apiURL}/projects`;

    constructor(
        private http: HttpClient
    ) { }

    getProjects(): Observable<Project[]>{
        return this.http.get<Project[]>(this.URL, httpOptions);
    }

    add(project: Project): Observable<Project>{
        return this.http.post<Project>(this.URL, project, httpOptions);
    }

    get(id: string){
        return this.http.get<Project>(`${this.URL}/${id}`, httpOptions);
    }

    update(id: string, updatedProject: Project){
        return this.http.put<Project>(`${this.URL}/${id}`, updatedProject, httpOptions);
    }
}
