import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';

// Services
import { ProjectService } from 'src/app/services/project.service';

// Models
import { Project } from 'src/app/models/Project';
import { AuthService } from 'src/app/services/auth.service';
import { User } from 'src/app/models/User';

@Component({
    selector: 'app-dash-projects',
    templateUrl: './dash-projects.component.html',
    styleUrls: ['./dash-projects.component.css']
})
export class DashProjectsComponent implements OnInit {
    projects: Project[] = [];
    currentUserAuh: User;
    error: string;
    httpError: string;
    loading: boolean = true;

    constructor(
        private projectService: ProjectService , 
        private authService: AuthService
    ) { }

    ngOnInit(): void {
        // Get Auth user
        this.authService.getCurrentAuthUser().subscribe(user => {
            this.currentUserAuh = user;

            if (this.currentUserAuh.role === "ROLE_COLLABORATER"){
                this.showCollaboraterProjects(this.currentUserAuh.id);
            }
            else {
                this.showAllProjects();
            }
        });
    }

    truncateChar(text: string): string {
        let charlimit = 90;
        if (!text || text.length <= charlimit) {
            return text;
        }

        let without_html = text.replace(/<(?:.|\n)*?>/gm, '');
        let shortened = without_html.substring(0, charlimit) + "...";
        return shortened;
    }

    showAllProjects(): void{
        this.projectService.getAllProjects().subscribe(
            (projects) => {
                if (projects.length !== 0) {
                    // Calaculate progress && project days left
                    this.calculateDueDateAndProgressOfProjects(projects)

                    this.projects = projects;
                    this.loading = false;
                } else {
                    this.error = 'There are no Projects in the system ...';
                    this.loading = false;
                }
            },
            (error: HttpErrorResponse) => {
                this.loading = false;

                if(error.status === 0)
                    this.httpError = 'Please make sure that the backend is working properly...';
                else
                    this.httpError = error.message;
            }
        );
    }

    showCollaboraterProjects(collaboraterId: number): void{
        this.projectService.getCollaboraterProjects(collaboraterId).subscribe(
            (projects) => {
                if (projects.length !== 0) {
                    // Calaculate progress && project days left
                    this.calculateDueDateAndProgressOfProjects(projects)

                    this.projects = projects;
                    this.loading = false;
                } else {
                    this.error = 'No project is assigned to you...';
                    this.loading = false;
                }
            },
            (error: HttpErrorResponse) => {
                this.loading = false;

                if(error.status === 0)
                    this.httpError = 'Please make sure that the backend is working properly...';
                else
                    this.httpError = error.message;
            }
        );
    }

    calculateDueDateAndProgressOfProjects(projects: Project[]): void{
        projects.forEach(project => {
            const daysLeft = Math.round((new Date(project.endDate).getTime() - new Date().getTime()) / (1000 * 3600 * 24));
            const completedTasks = project.tasks.filter(task => task.isComplete === true);

            project.daysLeft = daysLeft;
            project.progress = 0;

            if (project.tasks.length !== 0)
                project.progress = Math.round((completedTasks.length / project.tasks.length) * 100);
        });
    }

}
