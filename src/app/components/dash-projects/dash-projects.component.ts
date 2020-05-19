import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';

// Services
import { ProjectService } from 'src/app/services/project.service';

// Models
import { Project } from 'src/app/models/Project';

@Component({
    selector: 'app-dash-projects',
    templateUrl: './dash-projects.component.html',
    styleUrls: ['./dash-projects.component.css']
})
export class DashProjectsComponent implements OnInit {
    projects: Project[] = [];
    error: string;
    httpError: string;
    loading: boolean = true;

    constructor(private projectService: ProjectService) { }

    ngOnInit(): void {
        this.projectService.getProjects().subscribe(
            projects => {
                if (projects.length !== 0) {
                    // Calaculate progress && project days left
                    projects.forEach(project => {
                        const daysLeft = Math.round((new Date(project.endDate).getTime() - new Date().getTime()) / (1000 * 3600 * 24));
                        const completedTasks = project.tasks.filter(task => task.isComplete === true);

                        project.daysLeft = daysLeft;
                        project.progress = 0;

                        if (project.tasks.length !== 0)
                            project.progress = Math.round((completedTasks.length / project.tasks.length) * 100);
                    });

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
                    this.httpError = error.error.message;
            }
        );
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
}
