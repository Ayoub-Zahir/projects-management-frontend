import { Component, OnInit } from '@angular/core';
import { View, EventSettingsModel } from '@syncfusion/ej2-angular-schedule';
import { TaskService } from 'src/app/services/task.service';
import { AuthService } from 'src/app/services/auth.service';
import { Task } from 'src/app/models/Task';
import { CollaboraterTask } from 'src/app/models/CollaboraterTask';

@Component({
    selector: 'app-scheduler',
    templateUrl: './scheduler.component.html',
    styleUrls: ['./scheduler.component.css']
})
export class SchedulerComponent implements OnInit {
    initView: View = 'Month';
    setViews: View[] = ['Day', 'Week','Month'];

    loading: boolean = true;

    scheduledTasks: EventSettingsModel = { dataSource: [] }

    constructor(
        private taskService: TaskService,
        private authService: AuthService
    ) { }

    ngOnInit(): void {
        // Get Auth user
        this.authService.getCurrentAuthUser().subscribe(user => {

            if (user.role === "ROLE_COLLABORATER") {
                this.showCollaboraterTasks(user.tasks);
            }
            else {
                this.showAllTasks();
            }
        });
    }

    showCollaboraterTasks(collaboraterTasks: CollaboraterTask[]){
        this.prepareScheduler(collaboraterTasks.map(collabTask => collabTask.task));
    }

    showAllTasks(){
        this.taskService.getTasks().subscribe(tasks => {
            this.prepareScheduler(tasks);
        })
    }

    prepareScheduler(tasks: Task[]){
        let data = [];

        tasks.forEach(task => {
            data.push({
                Id: task.id,
                Subject: task.name,
                StartTime: task.startDate,
                EndTime: task.endDate,
                Description: task.description,
                IsReadonly: true
            });
        });

        setTimeout(() => {
            this.scheduledTasks.dataSource = data;
            this.loading = false;
        }, 300)
    }
}
