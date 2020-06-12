import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { User } from 'src/app/models/User';

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
    currentUser: User;

    constructor(private authService: AuthService) { }

    ngOnInit(): void {
        if (this.authService.isUserLogin()) {
            this.authService.getCurrentAuthUser().subscribe(
                (user) => this.currentUser = user
                ,
                (err) => {
                    if (err.status === 403)
                        console.error('403 forbidden unauthorized access');
                }
            );
        }
    }

    logout() {
        this.authService.logout();
    }
}
