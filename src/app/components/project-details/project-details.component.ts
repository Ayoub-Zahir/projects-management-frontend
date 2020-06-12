import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

// Models
import { Project } from 'src/app/models/Project';

// Services
import { ProjectService } from 'src/app/services/project.service';
import { AuthService } from 'src/app/services/auth.service';
import { User } from 'src/app/models/User';

@Component({
    selector: 'app-project-details',
    templateUrl: './project-details.component.html',
    styleUrls: ['./project-details.component.css']
})
export class ProjectDetailsComponent implements OnInit {
    loading: boolean = true;
    currentProject: Project;
    currentUserAuh: User;
    httpError: string;

    constructor(
        private projectService: ProjectService,
        private authService: AuthService,
        private activeRoute: ActivatedRoute
    ) { }

    ngOnInit(): void {
        // Get Auth user
        this.authService.getCurrentAuthUser().subscribe(user => {
            this.currentUserAuh = user;
        });

        const projectId = this.activeRoute.snapshot.paramMap.get('id');

        this.projectService.get(projectId).subscribe(
            project => {
                // Calculate project days left && Get completed task
                const daysLeft = Math.round((new Date(project.endDate).getTime() - new Date().getTime()) / (1000 * 3600 * 24));
                const completedTasks = project.tasks.filter(task => task.isComplete === true);

                project.daysLeft = daysLeft;
                project.completedTasks = completedTasks.length;

                setTimeout(() => {
                    this.currentProject = project;
                    this.loading = false;
                }, 300)
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
