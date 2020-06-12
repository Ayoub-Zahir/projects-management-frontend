import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Task } from 'src/app/models/Task';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';


const httpOptions = {
    headers: new HttpHeaders({ 'Content-type': 'application/json; charset=UTF-8' })
}

@Injectable({
    providedIn: 'root'
})
export class TaskService {

    private URL: string = `${environment.apiURL}`;

    constructor(private http: HttpClient) { }

    getTasks(): Observable<Task[]> {
        return this.http.get<Task[]>(`${this.URL}/manager/tasks`, httpOptions);
    }

    add(task: Task): Observable<Task> {
        return this.http.post<Task>(`${this.URL}/manager/tasks`, task, httpOptions).pipe(retry(3));
    }

    update(updatedTask: Task): Observable<Task> {
        return this.http.put<Task>(`${this.URL}/manager/tasks/${updatedTask.id}`, updatedTask, httpOptions).pipe(retry(3));
    }

    updateCompletedTask(updatedTask: Task): Observable<void> {
        return this.http.put<void>(`${this.URL}/manager/tasks/${updatedTask.id}/complete`, updatedTask.isComplete, httpOptions).pipe(
            retry(3),
            catchError((error: HttpErrorResponse) => {
                console.error(error.message);
                return throwError(error);
            })
        );
    }

    delete(id: string): Observable<void> {
        return this.http.delete<void>(`${this.URL}/manager/tasks/${id}`, httpOptions);
    }
}
