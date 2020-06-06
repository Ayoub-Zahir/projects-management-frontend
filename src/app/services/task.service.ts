import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Task } from 'src/app/models/Task';
import { Observable } from 'rxjs';
import { retry } from 'rxjs/operators';


const httpOptions = {
    headers: new HttpHeaders({'Content-type':'application/json; charset=UTF-8'})
}

@Injectable({
    providedIn: 'root'
})
export class TaskService {

    private URL: string = `${environment.apiURL}/tasks`;

    constructor(private http: HttpClient) { }

    getTasks(): Observable<Task[]>{
        return this.http.get<Task[]>(this.URL, httpOptions);
    }

    add(task: Task): Observable<Task>{
        return this.http.post<Task>(this.URL, task, httpOptions).pipe(retry(3));
    }

    update(updatedTask: Task): Observable<Task>{
        return this.http.put<Task>(`${this.URL}/${updatedTask.id}`, updatedTask, httpOptions).pipe(retry(3));
    }

    delete(id: string): Observable<void>{
        return this.http.delete<void>(`${this.URL}/${id}`, httpOptions);
    }
}
