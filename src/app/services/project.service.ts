import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpRequest, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Project } from 'src/app/models/Project';
import { Observable } from 'rxjs';
import { Task } from '../models/Task';

const headers: HttpHeaders = new HttpHeaders({'Content-type':'application/json; charset=UTF-8'});


@Injectable({
    providedIn: 'root'
})
export class ProjectService {

    private URL: string = `${environment.apiURL}/projects`;

    constructor(private http: HttpClient) { }

    getProjects(): Observable<Project[]> {
        return this.http.get<Project[]>(this.URL, { headers });
    }

    getProjectTasks(id: string ,pageNumber: number , rowsNumber: number): Observable<any>{
        const params: HttpParams = new HttpParams()
            .set('page', pageNumber.toString())
            .set('rows', rowsNumber.toString());

        return this.http.get<Task[]>(`${this.URL}/${id}/tasks`, { headers, params });
    }

    get(id: string): Observable<Project> {
        return this.http.get<Project>(`${this.URL}/${id}`, { headers });
    }

    add(project: Project): Observable<Project> {
        return this.http.post<Project>(this.URL, project, { headers });
    }

    update(id: string, updatedProject: Project) {
        return this.http.put<Project>(`${this.URL}/${id}`, updatedProject, { headers });
    }
}
