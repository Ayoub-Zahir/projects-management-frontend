import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import Swal from 'sweetalert2';

// Models
import { Project } from 'src/app/models/Project';
import { Task } from 'src/app/models/Task';

// Services
import { ProjectService } from 'src/app/services/project.service';
import { TaskService } from 'src/app/services/task.service';

@Component({
    selector: 'app-project-details',
    templateUrl: './project-details.component.html',
    styleUrls: ['./project-details.component.css']
})
export class ProjectDetailsComponent implements OnInit {
    loading: boolean = true;
    currentProject: Project;
    httpError: string;
    currentTask: Task;

    constructor(
        private projectService: ProjectService,
        private taskService: TaskService,
        private activeRoute: ActivatedRoute
    ) { }

    ngOnInit(): void {
        const projectId = this.activeRoute.snapshot.paramMap.get('id');

        this.projectService.get(projectId).subscribe(
            project => {
                // Calculate project days left && Get completed task
                const daysLeft = Math.round((new Date(project.endDate).getTime() - new Date().getTime()) / (1000 * 3600 * 24));
                const completedTasks = project.tasks.filter(task => task.isComplete === true);

                project.daysLeft = daysLeft;
                project.completedTasks = completedTasks.length;

                this.currentProject = project;
                this.loading = false;

                // Init new Task
                this.currentTask = {
                    name: '',
                    hourlyVolume: null,
                    isComplete: false,
                    startDate: new Date().toLocaleDateString('en-CA'),
                    endDate: null,
                    description: '',
                    project: {id: this.currentProject.id}
                };
            },
            (error: HttpErrorResponse) => {
                this.loading = false;

                if (error.status === 0)
                    this.httpError = 'Please make sure that the backend is working properly...';
                else
                    this.httpError = error.error.message;

            }
        )
    }

    addTask(formVar){
        if(formVar.valid){
            this.currentTask.isComplete = formVar.value.state === 'In progress' ? false : true;
            
            this.taskService.add(this.currentTask).subscribe(
                () => {
                    Swal.fire({
                        position: 'top-end',
                        icon: 'success',
                        titleText: `Task has been successfully added`,
                        showConfirmButton: false,
                        timer: 2300,
                    });
                    formVar.reset();
                },
                (error: HttpErrorResponse) => {
                    if (error.status === 0)
                        this.httpError = 'Please make sure that the backend is working properly...';
                    else
                        this.httpError = error.error.message;
                }
            )
        }
    }

}
