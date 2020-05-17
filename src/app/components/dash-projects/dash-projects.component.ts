import { Component, OnInit } from '@angular/core';

// Services

// Models

@Component({
    selector: 'app-dash-projects',
    templateUrl: './dash-projects.component.html',
    styleUrls: ['./dash-projects.component.css']
})
export class DashProjectsComponent implements OnInit {
    projects = [];
    loading: boolean = false;


    constructor(
      
    ) { }

    ngOnInit(): void {

    }
}
