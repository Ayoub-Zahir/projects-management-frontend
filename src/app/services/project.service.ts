import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

import { Project } from 'src/app/models/Project';
import { Task } from '../models/Task';

const headers: HttpHeaders = new HttpHeaders({'Content-type':'application/json; charset=UTF-8'});

@Injectable({
    providedIn: 'root'
})
export class ProjectService {

    private URL: string = `${environment.apiURL}`;

    constructor(private http: HttpClient) { }

    getAllProjects(): Observable<Project[]> {
        return this.http.get<Project[]>(`${this.URL}/projects`, { headers });
    }

    getCollaboraterProjects(collaboraterId: number): Observable<Project[]> {
        return this.http.get<Project[]>(`${this.URL}/projects/collaborater/${collaboraterId}`, { headers });
    }

    getProjectTasks(id: string ,pageNumber: number , rowsNumber: number): Observable<any>{
        const params: HttpParams = new HttpParams()
            .set('page', pageNumber.toString())
            .set('rows', rowsNumber.toString());

        return this.http.get<Task[]>(`${this.URL}/projects/${id}/tasks`, { headers, params });
    }

    get(id: string): Observable<Project> {
        return this.http.get<Project>(`${this.URL}/projects/${id}`, { headers });
    }

    add(project: Project): Observable<Project> {
        return this.http.post<Project>(`${this.URL}/manager/projects`, project, { headers });
    }

    update(id: string, updatedProject: Project) {
        return this.http.put<Project>(`${this.URL}/manager/projects/${id}`, updatedProject, { headers });
    }
}
