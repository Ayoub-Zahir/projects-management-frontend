import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

// Models
import { Project } from 'src/app/models/Project';

// Services
import { ProjectService } from 'src/app/services/project.service';

@Component({
    selector: 'app-project-details',
    templateUrl: './project-details.component.html',
    styleUrls: ['./project-details.component.css']
})
export class ProjectDetailsComponent implements OnInit {
    loading: boolean = true;
    currentProject: Project;
    httpError: string;

    constructor(
        private projectService: ProjectService,
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

}
