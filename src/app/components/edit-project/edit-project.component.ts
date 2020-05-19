import { Component, OnInit } from '@angular/core';
import { ProjectService } from 'src/app/services/project.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Project } from 'src/app/models/Project';
import { HttpErrorResponse } from '@angular/common/http';
import Swal from 'sweetalert2';

@Component({
    selector: 'app-edit-project',
    templateUrl: './edit-project.component.html',
    styleUrls: ['./edit-project.component.css']
})
export class EditProjectComponent implements OnInit {
    currentProject: Project;
    loading: boolean = true;
    httpError: string;
    updateProcessLoading: boolean = false;

    constructor(
        private projectService: ProjectService,
        private activeRoute: ActivatedRoute,
        private router: Router
    ) { }

    ngOnInit(): void {
        const projectId = this.activeRoute.snapshot.paramMap.get('id');

        this.projectService.get(projectId).subscribe(
            project => {
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

    onUpdateProject(formVar) {
        if (formVar.valid) {
            this.updateProcessLoading = true;

            // Update project
            this.projectService.update(this.currentProject.id.toString(), this.currentProject)
                .subscribe(
                    () => {
                        this.updateProcessLoading = false;

                        this.router.navigate([`/projects/${this.currentProject.id}`])
                            .then(() => {
                                Swal.fire({
                                    position: 'top-end',
                                    icon: 'success',
                                    titleText: 'The Project has been successfully updated',
                                    showConfirmButton: false,
                                    timer: 2300,
                                });
                            });

                        formVar.reset();
                    }, (error: HttpErrorResponse) => {
                        this.updateProcessLoading = false;

                        if (error.status === 0)
                            this.httpError = 'Please make sure that the backend is working properly...';
                        else
                            this.httpError = error.error.message;
                    }
                )
        } else {
            // Error form invalid
            formVar.form.markAllAsTouched();
            Swal.fire({
                icon: 'error',
                title: 'From invalid...',
                text: 'Please fill out the form correctly!',
                showCloseButton: true,
                confirmButtonText: 'Try Again',
                focusConfirm: false,
            });
        }
    }
}
