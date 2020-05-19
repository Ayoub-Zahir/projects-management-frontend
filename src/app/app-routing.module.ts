import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Components
import { DashProjectsComponent } from './components/dash-projects/dash-projects.component';
import { AddProjectComponent } from './components/add-project/add-project.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { ProjectDetailsComponent } from './components/project-details/project-details.component';
import { EditProjectComponent } from './components/edit-project/edit-project.component';

const routes: Routes = [
    { path: "", redirectTo: '/projects', pathMatch: 'full' },
    // Project Management --------------------------------------------------------------------
    { path: "projects", component: DashProjectsComponent},
    { path: "projects/add", component: AddProjectComponent},
    { path: "projects/:id", component: ProjectDetailsComponent},
    { path: "projects/edit/:id", component: EditProjectComponent},
    //------------------------------------------------------------------
    { path: "**", component: PageNotFoundComponent}
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
export const routingComponents = [DashProjectsComponent, AddProjectComponent, PageNotFoundComponent, ProjectDetailsComponent, EditProjectComponent];