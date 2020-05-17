import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Components
import { DashProjectsComponent } from './components/dash-projects/dash-projects.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';

const routes: Routes = [
    { path: "", redirectTo: '/projects', pathMatch: 'full' },
    { path: "dashboard", redirectTo: '/projects', pathMatch: 'full' },
    // Project Management --------------------------------------------------------------------
    { path: "projects", component: DashProjectsComponent},
    //----------------------------------------------------------------------------------------
    { path: "**", component: PageNotFoundComponent}
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
export const routingComponents = [DashProjectsComponent, PageNotFoundComponent];