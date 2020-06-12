import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { User } from 'src/app/models/User';

@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
    currentUser: User;
    isChevronRight: boolean = false;

    constructor(private authService: AuthService) { }

    ngOnInit(): void {
        if(this.authService.isUserLogin()){
            this.authService.getCurrentAuthUser().subscribe(user => {
                this.currentUser = user;
            });
        }
    }

}
