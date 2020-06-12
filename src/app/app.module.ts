import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

// Components
import { AppComponent } from './app.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { NavbarComponent } from './components/navbar/navbar.component';

// Services
import { ProjectService } from 'src/app/services/project.service';
import { CompetenceService } from 'src/app/services/competence.service';
import { UserService } from 'src/app/services/user.service';
import { TaskService } from 'src/app/services/task.service';
import { TokenInterceptorService } from 'src/app/services/token-interceptor.service';

// Syncfusion Schedule
import { ScheduleModule, RecurrenceEditorModule, DayService, WeekService, MonthService } from '@syncfusion/ej2-angular-schedule';

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
        AppRoutingModule,
        ScheduleModule, 
        RecurrenceEditorModule
    ],
    providers: [
        ProjectService,
        CompetenceService,
        UserService,
        TaskService,
        { 
            provide: HTTP_INTERCEPTORS,
            useClass: TokenInterceptorService,
            multi: true
        },
        DayService, WeekService, MonthService
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
