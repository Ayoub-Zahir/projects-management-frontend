import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

// Models
import { Task } from 'src/app/models/Task';
import { Competence } from 'src/app/models/Competence';
import { User } from 'src/app/models/User';

// Services
import { ProjectService } from 'src/app/services/project.service';
import { CompetenceService } from 'src/app/services/competence.service';
import { UserService } from 'src/app/services/user.service';
import { TaskService } from 'src/app/services/task.service';

// Alert
import Swal from 'sweetalert2';
import { AuthService } from 'src/app/services/auth.service';

declare var UIkit: any;

@Component({
    selector: 'app-dash-tasks',
    templateUrl: './dash-tasks.component.html',
    styleUrls: ['./dash-tasks.component.css']
})
export class DashTasksComponent implements OnInit {
    // Loading
    loading: boolean = true;
    addProcessLoading: boolean = false;
    editProcessLoading: boolean = false;

    // Data
    projectId: string;
    projectTasks: Task[] = [];
    currentTask: Task = {
        name: '',
        hourlyVolume: null,
        isComplete: false,
        startDate: new Date().toLocaleDateString('en-CA'),
        endDate: null,
        description: '',
        project: { id: null },
        collaboraters: [],
        competences: []
    }
    currentUserAuh: User;

    // Searched data
    searchedCompetences: Competence[] = [];
    searchedCollaboraters: User[] = [];

    // State management
    addState: boolean = true;

    // Pagination
    totalTasks: number;
    pageNumbers: number[];
    currentPage: number = 0;
    rowsNumber: number = 3;

    // Errors
    httpError: string;

    constructor(
        private projectService: ProjectService,
        private competenceService: CompetenceService,
        private userService: UserService,
        private taskService: TaskService,
        private authService: AuthService,
        private activeRoute: ActivatedRoute
    ) { }

    ngOnInit(): void {
        // Get Auth user
        this.authService.getCurrentAuthUser().subscribe(user => {
            this.currentUserAuh = user;
        });

        this.projectId = this.activeRoute.snapshot.paramMap.get('id');

        this.projectService.getProjectTasks(this.projectId, this.currentPage, this.rowsNumber).subscribe(
            taskPage => {
                setTimeout(() => {
                    this.totalTasks = taskPage.totalElements;
                    this.projectTasks = taskPage.content;
                    this.pageNumbers = new Array(taskPage.totalPages);
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

    // Pagination ------------------
    selectPage(pageNumber): void {
        if (pageNumber >= 0 && pageNumber < this.pageNumbers.length) {
            this.currentPage = pageNumber;

            // Refresh Ui
            this.loading = true;
            this.ngOnInit();
        }
    }

    setRowsPerPage(rows): void {
        this.rowsNumber = rows.value;
        rows.value = '';

        // Refresh Ui
        this.loading = true;
        this.ngOnInit();
    }

    // State Managemet --------------
    setEditState(task: Task) {
        this.currentTask = task;
        this.addState = false;
        UIkit.offcanvas('#offcanvas-flip').show()

        // Check if in second part of the form
        if (document.getElementById("back").offsetParent !== null)
            document.getElementById("back").click();
    }

    resetState(formVar) {
        this.addState = true;
        // Reset form
        this.currentTask = {
            name: '',
            hourlyVolume: null,
            isComplete: false,
            startDate: new Date().toLocaleDateString('en-CA'),
            endDate: null,
            description: '',
            project: { id: null },
            collaboraters: [],
            competences: []
        }
        formVar.form.markAsUntouched();

        // Clear search
        this.searchedCompetences = [];
        this.searchedCollaboraters = [];

        // Check if in second part of the form
        if (document.getElementById("back").offsetParent !== null)
            document.getElementById("back").click();
    }

    // Submit
    onSubmitTask(formVar): void {
        if (formVar.valid) {
            const totalCollabWh = this.currentTask.collaboraters.reduce((total, collab) => total + collab.workingHours, 0);

            // Check if Total working time is equal to the HV of the task
            if (totalCollabWh === this.currentTask.hourlyVolume) {

                // Check if some collaboraters exceed 8 hours a day
                if (this.checkCollabsWHPerDay()) {
                    if (this.addState)
                        this.addTask(formVar);
                    else
                        this.editTask(formVar);
                }
                else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Some collaborater exceed 8 hours a day!!',
                        showCloseButton: true,
                        confirmButtonText: 'Try Again',
                        focusConfirm: false,
                    });
                }
            }
            else {
                if (totalCollabWh < this.currentTask.hourlyVolume) {
                    // Hours left
                    Swal.fire({
                        icon: 'error',
                        title: `${this.currentTask.hourlyVolume - totalCollabWh} hours left`,
                        text: `Total working time of the collaboraters must be equal to the hourly volume of the task!!`,
                        showCloseButton: true,
                        confirmButtonText: 'Try Again',
                        focusConfirm: false,
                    });
                }
                else if (totalCollabWh > this.currentTask.hourlyVolume) {
                    // Hours excess
                    Swal.fire({
                        icon: 'error',
                        title: `Excess of ${totalCollabWh - this.currentTask.hourlyVolume} hours`,
                        text: `Total working time of the collaboraters must be equal to the hourly volume of the task!!`,
                        showCloseButton: true,
                        confirmButtonText: 'Try Again',
                        focusConfirm: false,
                    });
                }
            }
        } else {
            // Error form invalid
            formVar.form.markAllAsTouched();

            // Click on back button
            document.getElementById("back").click();

            // Faild Alert
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

    // CRUD
    addTask(formVar) {
        this.addProcessLoading = true;
        this.currentTask.project.id = parseInt(this.projectId);

        // Delete competences and tasks properties from taskcollaboraters
        this.currentTask.collaboraters.forEach(taskCollab => {
            delete taskCollab.collaborater.competences;
            delete taskCollab.collaborater.tasks;
        });

        // Post Request
        setTimeout(() => {
            this.taskService.add(this.currentTask).subscribe(
                () => {
                    this.addProcessLoading = false;

                    // Alert Success
                    Swal.fire({
                        position: 'top-end',
                        icon: 'success',
                        titleText: `Task has been successfully added`,
                        showConfirmButton: false,
                        timer: 2000,
                    })
                        .then(() => {
                            this.resetState(formVar);

                            // Show the last page that contains the new competence
                            if (this.projectTasks.length === 0) {
                                // Refresh Ui
                                this.loading = true;
                                this.ngOnInit();
                            }
                            else
                                this.selectPage(this.pageNumbers.length - 1);

                        });
                },
                (error) => {
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
                            title: error.message,
                            showCloseButton: true,
                            confirmButtonText: 'Ok',
                            focusConfirm: false,
                        });
                }
            );
        }, 500);
    }

    editTask(formVar) {
        this.editProcessLoading = true;

        // Delete competences and tasks properties from taskcollaboraters
        this.currentTask.collaboraters.forEach(taskCollab => {
            delete taskCollab.collaborater.competences;
            delete taskCollab.collaborater.tasks;
        });

        // Put Request
        setTimeout(() => {
            this.taskService.update(this.currentTask).subscribe(
                () => {
                    this.editProcessLoading = false;

                    // Alert Success
                    Swal.fire({
                        position: 'top-end',
                        icon: 'success',
                        titleText: `Task has been successfully updated`,
                        showConfirmButton: false,
                        timer: 2000,
                    })
                        .then(() => {
                            this.resetState(formVar);
                            this.selectPage(this.currentPage);
                        });            
                },
                (error) => {
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
                            title: error.message,
                            showCloseButton: true,
                            confirmButtonText: 'Ok',
                            focusConfirm: false,
                        });
                }
            );
        }, 500);
    }

    deleteTask(taskId: string) {
        Swal.fire({
            title: 'Are you sure you want to detete this task?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#F25F5C',
            cancelButtonColor: '#3C91E6',
            confirmButtonText: 'Yes, delete it!',
        })
            .then(result => {
                if (result.value) {
                    this.taskService.delete(taskId).subscribe(
                        () => {
                            // Case only one element on the page
                            if (this.projectTasks.length === 1)
                                this.selectPage(this.currentPage - 1);

                            this.selectPage(this.currentPage);

                            Swal.fire({
                                position: 'top-end',
                                icon: 'success',
                                titleText: `Task has been successfully deleted`,
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

    completeTaskToggle(task: Task){
        task.isComplete = !task.isComplete;
        this.taskService.updateCompletedTask(task).subscribe(() => '');
    }

    // Competences selection
    searchCompetences(keyword, event): void {
        // Clear div
        if (event.key === 'Backspace') {
            this.searchedCompetences = [];
        }

        // Only alphanumeric characters
        if (event.keyCode <= 90 && event.keyCode >= 48 || event.keyCode >= 96 && event.keyCode <= 105) {
            this.competenceService.search(keyword).subscribe(
                (competences) => {
                    this.searchedCompetences = competences;
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
            )
        }
    }

    onCheckCompetence(competence): void {
        if (this.isCompetenceSelected(competence))
            this.deleteCompetence(competence);
        else {
            this.currentTask.competences.push(competence);
            this.checkCompetenceInCollaboraters(competence);
        }
    }

    isCompetenceSelected(competence): boolean {
        const matchingCompetences = this.currentTask.competences.filter(taskCompetence => taskCompetence.id === competence.id);
        return matchingCompetences.length === 1;
    }

    deleteCompetence(competence): void {
        const index = this.currentTask.competences.indexOf(competence);
        this.currentTask.competences.splice(index, 1);
    }

    checkCompetenceInCollaboraters(competence: Competence) {
        this.currentTask.collaboraters.forEach(collab => {
            if (!collab.collaborater.competences.find(c => c.id === competence.id)) {
                // Warning
                Swal.fire({
                    position: 'center',
                    icon: 'warning',
                    titleText: `${collab.collaborater.firstName.toUpperCase()} ${collab.collaborater.lastName.toUpperCase()} has been deleted from this task, he doesn't have ${competence.name} competence!!`,
                    showConfirmButton: true
                })
                    .then(() => this.deleteCollaborater(collab));
            }
        });
    }

    // Collaboraters selection
    searchCollaboraters(keyword, event): void {
        // Clear div
        if (event.key === 'Backspace') {
            this.searchedCollaboraters = [];
        }

        // Only alphanumeric characters
        if (event.keyCode <= 90 && event.keyCode >= 48 || event.keyCode >= 96 && event.keyCode <= 105) {
            this.userService.searchCollabboraters(keyword).subscribe(
                (collaboraters) => {
                    this.searchedCollaboraters = collaboraters;
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
            )
        }
    }

    onCheckCollaborater(collaborater: User, workingHours: any, checkbox: any): void {
        // Delete 
        if (this.isCollaboraterSelected(collaborater)) {
            this.deleteCollaborater({ collaborater, workingHours: workingHours.value });
            workingHours.value = this.getDefaultWH();
        }
        else {
            if (workingHours.value > 0) {
                // Add if Collaborater qualified
                if (this.isCollaboraterQualified(collaborater)) {
                    // Check for collaborater charge per day <= 8
                    const currentTaskWHPerDay = Math.round(workingHours.value / this.getTaskDuration(this.currentTask));
                    const totalWHPerDay = currentTaskWHPerDay + this.getCollabWHPerDay(collaborater);
                    const CHARGE_PER_DAY = 8; // 8 hours

                    if (totalWHPerDay <= CHARGE_PER_DAY) {
                        // Set other collabs WH => to be fair
                        this.currentTask.collaboraters.forEach(collab => {
                            collab.workingHours = parseInt(workingHours.value);
                        });

                        this.currentTask.collaboraters.push({ collaborater, workingHours: parseInt(workingHours.value) });
                    }
                    else {
                        checkbox.checked = false;
                        Swal.fire({
                            icon: 'error',
                            title: 'Collaborater exceeded 8 hours per day!!',
                            showCloseButton: true,
                            confirmButtonText: 'Try Again',
                            focusConfirm: false,
                        });
                    }
                }
                else {
                    checkbox.checked = false;
                    Swal.fire({
                        icon: 'error',
                        title: 'Collaborater is not qualified for the task !!',
                        showCloseButton: true,
                        confirmButtonText: 'Try Again',
                        focusConfirm: false,
                    });
                }
            }
            else {
                checkbox.checked = false;
                Swal.fire({
                    icon: 'error',
                    title: 'Hours of work must be greater than zero!!',
                    showCloseButton: true,
                    confirmButtonText: 'Try Again',
                    focusConfirm: false,
                });
            }
        }

    }

    isCollaboraterSelected(collaborater): boolean {
        const matchingCollaboraters = this.currentTask.collaboraters.map(collaboraterTask => collaboraterTask.collaborater).filter(collab => collab.id === collaborater.id);

        return matchingCollaboraters.length === 1;
    }

    deleteCollaborater(collaboraterTask): void {
        const index = this.currentTask.collaboraters.indexOf(collaboraterTask);
        this.currentTask.collaboraters.splice(index, 1);
        this.setNewWH();
    }

    getCollaboraterIndex(collaborater): number {
        let index: number = -1;

        this.currentTask.collaboraters.forEach((collaboraterTask, i) => {
            if (collaboraterTask.collaborater.id === collaborater.id) {
                index = i;
            }
        });

        return index;
    }

    // Constraints 
    isCollaboraterQualified(collaborater: User): boolean {
        // Intersection currentTask.competences and collaborater.competences
        const intersection: Competence[] = this.currentTask.competences.filter(taskCompetence => collaborater.competences.find(c => c.id === taskCompetence.id));

        return this.currentTask.competences.length === intersection.length;
    }

    checkWH(collaborater: User): void {
        const taskCollabs: number = this.currentTask.collaboraters.length;
        const taskVH: number = this.currentTask.hourlyVolume;
        const MARGIN_PERCENTAGE: number = Math.round(taskVH * 0.1); // 10%

        const maxBound: number = Math.round((taskVH / taskCollabs) + MARGIN_PERCENTAGE);
        const maxOffset: number = Math.round((taskVH - maxBound) / (taskCollabs - 1));

        const minBound: number = Math.round((taskVH / taskCollabs) - MARGIN_PERCENTAGE);
        const minOffset: number = Math.round((taskVH - minBound) / (taskCollabs - 1));

        const collabIndex: number = this.getCollaboraterIndex(collaborater);
        const collabVHT: number = this.currentTask.collaboraters[collabIndex].workingHours;

        if (collabVHT > maxBound && taskCollabs > 1) {
            // console.log('maxBound');
            Swal.fire({
                icon: 'warning',
                title: `Max = ${maxBound} hours and Min = ${minBound} hours`,
                text: `The distribution of working time must be fair!!`,
                showCloseButton: true,
                focusConfirm: false,
            });

            this.currentTask.collaboraters.forEach(collab => {
                collab.workingHours = maxOffset;
            });

            this.currentTask.collaboraters[collabIndex].workingHours = maxBound;
        }
        else if (collabVHT < minBound && taskCollabs > 1) {
            // console.log('minBound');
            Swal.fire({
                icon: 'warning',
                title: `Max = ${maxBound} hours and Min = ${minBound} hours`,
                text: `The distribution of working time must be fair!!`,
                showCloseButton: true,
                focusConfirm: false,
            });

            this.currentTask.collaboraters.forEach(collab => {
                collab.workingHours = minOffset;
            });

            this.currentTask.collaboraters[collabIndex].workingHours = minBound;
        }

    }

    checkCollabsWHPerDay(): boolean {
        let res: boolean = true;

        this.currentTask.collaboraters.forEach(taskCollabs => {
            if (this.getCollabWHPerDay(taskCollabs.collaborater) > 8) {
                res = false;
            }
        });

        return res;
    }

    // Helpers
    clearSearch(key, keyword): void {
        key.value = null;
        keyword.value = null;
    }

    clearCompetencesSearch(keyword): void {
        keyword.value = '';
        this.searchedCompetences = [];
    }

    clearCollabsSearch(key): void {
        key.value = '';
        this.searchedCollaboraters = [];
    }

    getDefaultWH(): number {
        const taskCollabslength = this.currentTask.collaboraters.length;
        const taskVH = this.currentTask.hourlyVolume;

        return Math.floor(taskVH / (taskCollabslength + 1));
    }

    setNewWH(): void {
        const taskCollabslength = this.currentTask.collaboraters.length;
        const taskVH = this.currentTask.hourlyVolume;

        if (taskCollabslength > 0) {
            this.currentTask.collaboraters.forEach(collab => {
                collab.workingHours = Math.floor(taskVH / taskCollabslength);
            });
        }
    }

    getCollabWHPerDay(collaborater: User): number {
        if (collaborater.tasks) {
            // Check if the current task in collaborater tasks 
            const isCurrentTaskExist: boolean = collaborater.tasks.map(c => c.task).filter(t => t.id === this.currentTask.id).length === 1;

            // Push the current task in collaorater tasks if not existed already
            if (this.getCollaboraterIndex(collaborater) !== -1) {
                if (!isCurrentTaskExist) {
                    collaborater.tasks.push({
                        task: this.currentTask,
                        workingHours: this.currentTask.collaboraters[this.getCollaboraterIndex(collaborater)].workingHours
                    });
                }
                else {
                    // Update Collaboater WH in  collaborater.tasks array
                    const newCollabWH = this.currentTask.collaboraters[this.getCollaboraterIndex(collaborater)].workingHours;
                    const oldCollabWH = collaborater.tasks[collaborater.tasks.length - 1].workingHours;

                    if (newCollabWH !== null && (newCollabWH !== oldCollabWH)) {
                        collaborater.tasks[collaborater.tasks.length - 1].workingHours = newCollabWH;
                    }
                }
            }

            // Pop the current task from collaborater tasks if the collaborater is no longer selected
            if (!this.isCollaboraterSelected(collaborater) && isCurrentTaskExist) {
                collaborater.tasks.pop();
            }

            const totalHoursPerDay = collaborater.tasks.reduce((total, collaboraterTask) => total + Math.round(collaboraterTask.workingHours / this.getTaskDuration(collaboraterTask.task)), 0);

            return totalHoursPerDay;
        }

    }

    getTaskDuration(task: Task): number {
        return Math.round((new Date(task.endDate).getTime() - new Date(task.startDate).getTime()) / (1000 * 3600 * 24));
    }

    getcurrentTaskWHPerDay(): number {
        return Math.round(this.currentTask.hourlyVolume / this.getTaskDuration(this.currentTask));
    }
}
