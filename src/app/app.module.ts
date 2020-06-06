import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

// Components
import { AppComponent } from './app.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { NavbarComponent } from './components/navbar/navbar.component';

// Services
import { ProjectService } from 'src/app/services/project.service';
import { CompetenceService } from 'src/app/services/competence.service';
import { CollaboraterService } from 'src/app/services/collaborater.service';
import { TaskService } from 'src/app/services/task.service';

// App Routing
import { AppRoutingModule, routingComponents } from './app-routing.module';


@NgModule({
    declarations: [
        AppComponent,
        routingComponents,
        SidebarComponent,
        NavbarComponent
    ],
    imports: [
        BrowserModule,
        FormsModule,
        HttpClientModule,
        AppRoutingModule
    ],
    providers: [
        ProjectService,
        CompetenceService,
        CollaboraterService,
        TaskService
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
