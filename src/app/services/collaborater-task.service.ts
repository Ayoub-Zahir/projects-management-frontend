import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { CollaboraterTask } from 'src/app/models/CollaboraterTask';
import { Observable } from 'rxjs';

const httpOptions = {
    headers: new HttpHeaders({ 'Content-type': 'application/json; charset=UTF-8' })
}

@Injectable({
    providedIn: 'root'
})
export class CollaboraterTaskService {

    private URL: string = `${environment.apiURL}/collaborater_task`;

    constructor(private http: HttpClient) { }

    getCollaboraterTasks(): Observable<CollaboraterTask[]> {
        return this.http.get<CollaboraterTask[]>(this.URL, httpOptions);
    }

    add(collaboraterbtask: CollaboraterTask): Observable<CollaboraterTask> {
        return this.http.post<CollaboraterTask>(this.URL, collaboraterbtask, httpOptions);
    }

    get(id: string) {
        return this.http.get<CollaboraterTask>(`${this.URL}/${id}`, httpOptions);
    }

    update(id: string, updatedCollaboraterTask: CollaboraterTask) {
        return this.http.put<CollaboraterTask>(`${this.URL}/${id}`, updatedCollaboraterTask, httpOptions);
    }
}
