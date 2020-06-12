import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';

// Models
import { User } from 'src/app/models/User';

// Services
import { UserService } from 'src/app/services/user.service';

import Swal from 'sweetalert2';
import { AuthService } from 'src/app/services/auth.service';
declare var UIkit: any;

@Component({
    selector: 'app-dash-managers',
    templateUrl: './dash-managers.component.html',
    styleUrls: ['./dash-managers.component.css']
})
export class DashManagersComponent implements OnInit {
    // Data
    managers: User[];
    currentManager: User = {
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        role: 'ROLE_MANAGER',
        photoURL: '',
        active: true,
        competences: [],
    };
    currentUserAuh: User;

    // State management
    loading: boolean = true;
    addState: boolean = true;

    // Pagination
    totalManagers: number;
    pageNumbers: number[];
    currentPage: number = 0;
    rowsNumber: number = 5;

    // Errors
    httpError: string;

    constructor(
        private userService: UserService,
        private authService: AuthService
    ) { }

    ngOnInit(): void {
        // Get Auth user
        this.authService.getCurrentAuthUser().subscribe(user => {
            this.currentUserAuh = user;
        })

        // Get managers
        this.userService.getManagers(this.currentPage, this.rowsNumber).subscribe(
            managerPage => {
                setTimeout(() => {
                    this.totalManagers = managerPage.totalElements;
                    this.managers = managerPage.content;
                    this.pageNumbers = new Array(managerPage.totalPages);
                    this.loading = false;
                }, 300)
            },
            (error: HttpErrorResponse) => {
                this.loading = false;

                if (error.status === 0)
                    this.httpError = 'Please make sure that the backend is working properly...';
                else
                    this.httpError = error.message;
            }
        );
    }

    // Pagination ------------------
    selectPage(pageNumber) {
        if (pageNumber >= 0 && pageNumber < this.pageNumbers.length) {
            this.currentPage = pageNumber;

            // Refresh Ui
            this.loading = true;
            this.ngOnInit();
        }
    }

    setRowsPerPage(rows) {
        this.rowsNumber = rows.value;
        rows.value = '';

        // Refresh Ui
        this.loading = true;
        this.ngOnInit();
    }

    // CRUD Operations ---------------
    onSubmitManager(formVar) {
        if (formVar.valid) {
            if (this.addState)
                this.addManager(formVar);
            else
                this.editManager(formVar);

        } else
            formVar.form.markAllAsTouched();
    }

    addManager(formVar) {
        // Set Default img
        if(!this.currentManager.photoURL){
            this.currentManager.photoURL = 'assets/img/manager.svg';
            formVar.form.markAsUntouched();
        }

        this.userService.add(this.currentManager).subscribe(
            (manager) => {
                // Show the last page that contains the new competence
                this.selectPage(this.pageNumbers.length - 1);

                this.resetState(formVar);
                Swal.fire({
                    position: 'top-end',
                    icon: 'success',
                    titleText: `Manager : ${manager.firstName} has been successfully created`,
                    showConfirmButton: false,
                    timer: 1500,
                });
            },
            (error: HttpErrorResponse) => {     
                console.error(error.error.message);           
                if (error.status === 0)
                    Swal.fire({
                        icon: 'error',
                        title: 'Please make sure that the backend is working properly...',
                        showCloseButton: true,
                        confirmButtonText: 'Ok',
                        focusConfirm: false,
                    });
                else if(error.error.message.includes("Email already exist")){
                    formVar.controls.email.setErrors({ 'emailExist': true });
                }
            }
        );
    }

    editManager(formVar) {
        this.userService.update(this.currentManager).subscribe(
            () => {
                // Show the last page that contains the new competence
                this.selectPage(this.currentPage)

                this.resetState(formVar);
                Swal.fire({
                    position: 'top-end',
                    icon: 'success',
                    titleText: `Manager has been successfully updated`,
                    showConfirmButton: false,
                    timer: 1500,
                });
            },
            (error: HttpErrorResponse) => {
                console.error(error.error.message);           

                if (error.status === 0){
                    Swal.fire({
                        icon: 'error',
                        title: 'Please make sure that the backend is working properly...',
                        showCloseButton: true,
                        confirmButtonText: 'Ok',
                        focusConfirm: false,
                    });
                }
                else if(error.error.message.includes("Email already exist")){
                    formVar.controls.email.setErrors({ 'emailExist': true });
                }
            }
        );
    }

    deleteManager(id) {
        Swal.fire({
            title: 'Are you sure you want to detete this Manager?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#F25F5C',
            cancelButtonColor: '#3C91E6',
            confirmButtonText: 'Yes, delete it!',
        })
            .then(result => {
                if (result.value) {
                    this.userService.delete(id).subscribe(
                        () => {
                            // Case only one element on the page
                            if (this.managers.length === 1)
                                this.selectPage(this.currentPage - 1);

                            this.selectPage(this.currentPage);

                            Swal.fire({
                                position: 'top-end',
                                icon: 'success',
                                titleText: `Manager has been successfully deleted`,
                                showConfirmButton: false,
                                timer: 2000,
                            });
                        },
                        (error: HttpErrorResponse) => {
                            console.error(error.error.message);           

                            if (error.status === 0){
                                Swal.fire({
                                    icon: 'error',
                                    title: 'Please make sure that the backend is working properly...',
                                    showCloseButton: true,
                                    confirmButtonText: 'Ok',
                                    focusConfirm: false,
                                });
                            }
                        }
                    );
                }
            })
    }

    // State Managemet --------------
    setEditState(manager) {
        this.currentManager = manager;
        this.addState = false;
        UIkit.modal('#add-manager').show();
    }

    resetState(formVar) {
        this.addState = true;
        this.currentManager = {
            firstName: '',
            lastName: '',
            email: '',
            active: true,
            role: 'ROLE_MANAGER',
            photoURL: '',
            competences: []
        };
        formVar.form.markAsUntouched();
    }
}
