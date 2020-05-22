import { Component, OnInit } from '@angular/core';
import { Competence } from 'src/app/models/Competence';
import { CompetenceService } from 'src/app/services/competence.service';
import { HttpErrorResponse } from '@angular/common/http';
import Swal from 'sweetalert2';
declare var UIkit: any;

@Component({
    selector: 'app-dash-competence',
    templateUrl: './dash-competence.component.html',
    styleUrls: ['./dash-competence.component.css']
})
export class DashCompetenceComponent implements OnInit {
    loading: boolean = true;
    competences: Competence[];
    currentCompetence: Competence = { name: '' };
    addState: boolean = true;
    totalCompetences: number;
    pageNumbers: number[];
    currentPage: number = 0;
    rowsNumber: number = 5;
    httpError: string;

    constructor(private competenceService: CompetenceService) { }

    ngOnInit(): void {
        this.competenceService.getCompetences(this.currentPage, this.rowsNumber).subscribe(
            competencePage => {
                this.totalCompetences = competencePage.totalElements;
                this.competences = competencePage.content;
                this.pageNumbers = new Array(competencePage.totalPages);
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

    onSubmitCompetence(formVar) {
        if (formVar.valid) {
            if (this.addState)
                this.addCompetence(formVar);
            else
                this.editCompetence(formVar);

        } else
            formVar.form.markAllAsTouched();
    }

    addCompetence(formVar) {
        this.competenceService.add(this.currentCompetence).subscribe(
            (competence) => {
                // Show the last page that contains the new competence
                this.selectPage(this.pageNumbers.length - 1);

                formVar.reset();
                Swal.fire({
                    position: 'top-end',
                    icon: 'success',
                    titleText: `Competence : ${competence.name} has been successfully created`,
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

    editCompetence(formVar) {
        this.competenceService.update(this.currentCompetence).subscribe(
            () => {
                // Show the last page that contains the new competence
                this.selectPage(this.currentPage)

                this.resetState(formVar);
                Swal.fire({
                    position: 'top-end',
                    icon: 'success',
                    titleText: `Competence has been successfully deleted`,
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

    deleteCompetence(id) {
        Swal.fire({
            title: 'Are you sure you want to detete this Competence?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#F25F5C',
            cancelButtonColor: '#3C91E6',
            confirmButtonText: 'Yes, delete it!',
        })
            .then(result => {
                if (result.value) {
                    this.competenceService.delete(id).subscribe(
                        () => {
                            // Case only one element on the page
                            if (this.competences.length === 1)
                                this.selectPage(this.currentPage - 1);

                            this.selectPage(this.currentPage);

                            Swal.fire({
                                position: 'top-end',
                                icon: 'success',
                                titleText: `Competence has been successfully updated`,
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

    setEditState(competence) {
        this.currentCompetence = competence;
        this.addState = false;
        UIkit.modal('#add-competence').show();
    }

    resetState(formVar) {
        this.addState = true;
        this.currentCompetence = { name: '' };
        formVar.form.markAsUntouched();
    }
}

