import { Component, OnInit } from '@angular/core';

// Services
import { ProjectService } from 'src/app/services/project.service';

// Models
import { Project } from 'src/app/models/Project';

// Libs
import Swal from 'sweetalert2';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
    selector: 'app-add-project',
    templateUrl: './add-project.component.html',
    styleUrls: ['./add-project.component.css']
})
export class AddProjectComponent implements OnInit {

    addProcessLoading: boolean = false;
    currentProject: Project = {
        name: '',
        hourlyVolume: null,
        description: '',
        startDate: new Date().toLocaleDateString('en-CA'),
        endDate: null
    };

    constructor(private projectService: ProjectService) { }

    ngOnInit(): void { }

    onAddProject(addProjectform) {
        // VALID Form
        if (addProjectform.valid) {
            this.addProcessLoading = true;

            this.projectService.add(this.currentProject).subscribe(
                project => {
                    this.addProcessLoading = false;

                    Swal.fire({
                        position: 'center',
                        icon: 'success',
                        title: `The Project : ${project.name} has been successfully created`,
                        showCancelButton: true,
                        showConfirmButton: true,
                        confirmButtonText: `<a href="/projects/${project.id}" style="color: white;text-decoration: none;">Go To Project Details <span uk-icon="forward"></span></a>`,
                        cancelButtonText: 'Close <span uk-icon="close"></span>'
                    });
                    addProjectform.reset();
                },
                (error: HttpErrorResponse) => {
                    this.addProcessLoading = false;

                    if (error.status === 0)
                        Swal.fire({
                            icon: 'error',
                            title: 'Please make sure that the backend is working properly...',
                            showCloseButton: true,
                            confirmButtonText: 'Ok',
                            focusConfirm: false,
                        });
                    else
                        Swal.fire({
                            icon: 'error',
                            title: error.error.message,
                            showCloseButton: true,
                            confirmButtonText: 'Ok',
                            focusConfirm: false,
                        });
                }
            );
        } else {
            // Error form invalid
            addProjectform.form.markAllAsTouched();
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
