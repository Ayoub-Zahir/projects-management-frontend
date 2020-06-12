import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Components
import { DashProjectsComponent } from './components/dash-projects/dash-projects.component';
import { DashTasksComponent } from './components/dash-tasks/dash-tasks.component';
import { DashCompetencesComponent } from './components/dash-competences/dash-competences.component';
import { DashCollaboratersComponent } from './components/dash-collaboraters/dash-collaboraters.component';
import { DashManagersComponent } from './components/dash-managers/dash-managers.component';
import { AddProjectComponent } from './components/add-project/add-project.component';
import { ProjectDetailsComponent } from './components/project-details/project-details.component';
import { EditProjectComponent } from './components/edit-project/edit-project.component';
import { LoginComponent } from './components/login/login.component';
import { SchedulerComponent } from './components/scheduler/scheduler.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';

// Guards
import { AdminGuard } from './guards/admin.guard';
import { AdminManagerGuard } from './guards/admin-manager.guard';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
    { path: "", redirectTo: '/projects', pathMatch: 'full' },
    { path: "login", component: LoginComponent },
    // Project Management ----------------------------------------------
    { path: "projects", component: DashProjectsComponent, canActivate: [AuthGuard]},
    { path: "projects/add", component: AddProjectComponent, canActivate: [AdminManagerGuard]},
    { path: "projects/:id", component: ProjectDetailsComponent, canActivate: [AuthGuard]},
    { path: "projects/:id/tasks", component: DashTasksComponent, canActivate: [AuthGuard]},
    { path: "projects/edit/:id", component: EditProjectComponent, canActivate: [AdminManagerGuard]},
    // Managers Management ----------------------------------------------
    { path: "managers", component: DashManagersComponent, canActivate: [AdminGuard]},
    // Collaborater Management ----------------------------------------------
    { path: "collaboraters", component: DashCollaboratersComponent, canActivate: [AuthGuard]},
    // Competence Management ----------------------------------------------
    { path: "competences", component: DashCompetencesComponent, canActivate: [AdminManagerGuard]},
    { path: "scheduler", component: SchedulerComponent, canActivate: [AuthGuard]},
    { path: "**", component: PageNotFoundComponent, canActivate: [AuthGuard]}
];
@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
    providers: [AuthGuard, AdminGuard, AdminManagerGuard]
})
export class AppRoutingModule { }
export const routingComponents = [LoginComponent, DashProjectsComponent, AddProjectComponent, PageNotFoundComponent, ProjectDetailsComponent, EditProjectComponent, DashCompetencesComponent, DashCollaboratersComponent, DashTasksComponent, DashManagersComponent, SchedulerComponent];