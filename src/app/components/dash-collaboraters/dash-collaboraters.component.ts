import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';

// Models
import { Collaborater } from 'src/app/models/Collaborater';
import { Competence } from 'src/app/models/Competence';

// Services
import { CollaboraterService } from 'src/app/services/collaborater.service';
import { CompetenceService } from 'src/app/services/competence.service';

import Swal from 'sweetalert2';
declare var UIkit: any;

@Component({
    selector: 'app-dash-collaboraters',
    templateUrl: './dash-collaboraters.component.html',
    styleUrls: ['./dash-collaboraters.component.css']
})
export class DashCollaboratersComponent implements OnInit {
    // Data
    collaboraters: Collaborater[];
    currentCollaborater: Collaborater = {
        firstName: '',
        lastName: '',
        email: '',
        photoURL: '',
        competences: [],
        tasks: []
    };
    competences: Competence[] = [];

    // State management
    loading: boolean = true;
    addState: boolean = true;

    // Pagination
    totalCollaboraters: number;
    pageNumbers: number[];
    currentPage: number = 0;
    rowsNumber: number = 5;

    // Errors
    httpError: string;

    constructor(
        private collaboraterService: CollaboraterService,
        private competenceService: CompetenceService
    ) { }

    ngOnInit(): void {
        this.collaboraterService.getCollaboraters(this.currentPage, this.rowsNumber).subscribe(
            collaboraterPage => {
                this.totalCollaboraters = collaboraterPage.totalElements;
                this.collaboraters = collaboraterPage.content;
                this.pageNumbers = new Array(collaboraterPage.totalPages);
                this.loading = false;
            },
            (error: HttpErrorResponse) => {
                this.loading = false;

                if (error.status === 0)
                    this.httpError = 'Please make sure that the backend is working properly...';
                else
                    this.httpError = error.error.message;
            }
        );
    }

    // Pagination ------------------
    selectPage(pageNumber) {
        if (pageNumber >= 0 && pageNumber < this.pageNumbers.length) {
            this.currentPage = pageNumber;

            // Refresh Ui
            this.loading = true;
            setTimeout(() => {
                this.ngOnInit();
            }, 200)
        }
    }

    setRowsPerPage(rows) {
        this.rowsNumber = rows.value;
        rows.value = '';

        // Refresh Ui
        this.loading = true;
        setTimeout(() => {
            this.ngOnInit();
        }, 200)
    }

    // CRUD Operations ---------------
    onSubmitCollaborater(formVar) {
        if (formVar.valid) {
            if (this.addState)
                this.addCollaborater(formVar);
            else
                this.editCollaborater(formVar);

        } else
            formVar.form.markAllAsTouched();
    }

    addCollaborater(formVar) {
        // Set Default img
        if(!this.currentCollaborater.photoURL){
            this.currentCollaborater.photoURL = 'assets/img/user2.svg';
            formVar.form.markAsUntouched();
        }

        this.collaboraterService.add(this.currentCollaborater).subscribe(
            (collaborater) => {
                // Show the last page that contains the new competence
                this.selectPage(this.pageNumbers.length - 1);

                this.resetState(formVar);
                Swal.fire({
                    position: 'top-end',
                    icon: 'success',
                    titleText: `Collaborater : ${collaborater.firstName} has been successfully created`,
                    showConfirmButton: false,
                    timer: 1500,
                });
            },
            (error: HttpErrorResponse) => {
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
    }

    editCollaborater(formVar) {
        this.collaboraterService.update(this.currentCollaborater).subscribe(
            () => {
                // Show the last page that contains the new competence
                this.selectPage(this.currentPage)

                this.resetState(formVar);
                Swal.fire({
                    position: 'top-end',
                    icon: 'success',
                    titleText: `Collaborater has been successfully updated`,
                    showConfirmButton: false,
                    timer: 1500,
                });
            },
            (error: HttpErrorResponse) => {
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
    }

    deleteCollaborater(id) {
        Swal.fire({
            title: 'Are you sure you want to detete this Collaborater?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#F25F5C',
            cancelButtonColor: '#3C91E6',
            confirmButtonText: 'Yes, delete it!',
        })
            .then(result => {
                if (result.value) {
                    this.collaboraterService.delete(id).subscribe(
                        () => {
                            // Case only one element on the page
                            if (this.collaboraters.length === 1)
                                this.selectPage(this.currentPage - 1);

                            this.selectPage(this.currentPage);

                            Swal.fire({
                                position: 'top-end',
                                icon: 'success',
                                titleText: `Collaborater has been successfully deleted`,
                                showConfirmButton: false,
                                timer: 2000,
                            });
                        },
                        (error: HttpErrorResponse) => {
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
                }
            })
    }

    // State Managemet --------------
    setEditState(collaborater) {
        this.currentCollaborater = collaborater;
        this.addState = false;
        UIkit.modal('#add-collaborater').show();
    }

    resetState(formVar) {
        this.addState = true;
        this.competences = [];
        this.currentCollaborater = {
            firstName: '',
            lastName: '',
            email: '',
            photoURL: '',
            competences: []
        };
        formVar.form.markAsUntouched();
    }

    // Collaborater competences management
    searchCompetence(keyword, event): void{
        // Clear div
        if(event.key === 'Backspace'){
            this.competences = [];
        }

        // Only alphanumeric characters
        if(event.keyCode <= 90 && event.keyCode >= 48 || event.keyCode >= 96 && event.keyCode <= 105){
            this.competenceService.search(keyword).subscribe(
                (competences) => {
                    this.competences = competences;
                },
                (error: HttpErrorResponse) => {
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
            )
        }
    }

    onChecked(competence): void{
        // Check if the competence is already selected
        if(this.isSelected(competence)){
            // Delete 
            this.removeCompetence(competence);
        }else{
            // Add
            this.currentCollaborater.competences.push(competence);
        }
    }

    isSelected(competence): boolean{
        // Check if the competence in => currentCollaborater.competences array
        return this.currentCollaborater.competences.filter(e => e.id === competence.id).length > 0;
    }   

    removeCompetence(competence){
        const index = this.currentCollaborater.competences.indexOf(competence);
        this.currentCollaborater.competences.splice(index, 1);
    }

}
