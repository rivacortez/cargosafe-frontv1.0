import {Component, OnDestroy, OnInit} from '@angular/core';
import {MatToolbar} from "@angular/material/toolbar";
import {MatButton, MatIconButton} from "@angular/material/button";
import {MatIcon} from "@angular/material/icon";
import {MatMenu, MatMenuItem, MatMenuTrigger} from "@angular/material/menu";
import {LanguageSwitcherComponent} from "../language-switcher/language-switcher.component";
import {Router, RouterLink} from "@angular/router";
import {NgForOf, NgIf} from "@angular/common";
import {Subject, takeUntil} from "rxjs";
import {MatBadge} from "@angular/material/badge";
import {StatusEntity} from "../../../request-service/model/status.entity";
import {StatusService} from "../../../request-service/service/status.service";
import {NotificationsComponent} from "../../../request-service/components/notifications/notifications.component";
import {UserApiService} from "../../../iam/service/user-api.service";
import {
  ListTripsEntrepreneurComponent
} from "../../../trip/components/list-trips-entrepreneur/list-trips-entrepreneur.component";
import {MatDialog, MatDialogModule} from "@angular/material/dialog";

@Component({
  selector: 'app-toolbar-entrepreneur-content',
  standalone: true,
  imports: [
    MatToolbar,
    MatButton,
    MatIconButton,
    MatIcon,
    MatMenuTrigger,
    MatMenuItem,
    MatMenu,
    LanguageSwitcherComponent,
    RouterLink,
    NgIf,
    NgForOf,
    MatBadge,
    NotificationsComponent,
    MatDialogModule,
    ListTripsEntrepreneurComponent

  ],
  templateUrl: './toolbar-entrepreneur-content.component.html',
  styleUrl: './toolbar-entrepreneur-content.component.css'
})
export class ToolbarEntrepreneurContentComponent  implements OnInit, OnDestroy {
  notificationCount: number = 0;
  notifications: StatusEntity[] = [];
  private unsubscribe$ = new Subject<void>();

  constructor(private statusService: StatusService,
              private router: Router,
              private userApiService: UserApiService,
              private dialog: MatDialog
               ) {}

  ngOnInit(): void {
    this.loadStatuses();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  loadStatuses(): void {
    this.statusService.getAllStatuses().pipe(
      takeUntil(this.unsubscribe$)
    ).subscribe({
      next: (statuses) => {
        this.notifications = statuses;
        this.notificationCount = this.notifications.length;
      },
      error: (err) => {
        console.error('Failed to load statuses', err);
      }
    });
  }
  logout() {
    this.userApiService.setLogged(false);
    this.router.navigate(['/login']);
  }
  removeNotification(index: number): void {
    this.notifications.splice(index, 1);
    this.notificationCount = this.notifications.length;
  }

  openTripsDialog(): void {
    this.dialog.open(ListTripsEntrepreneurComponent, {
      width: '400px',
      height: '500px',
      panelClass: 'custom-dialog-container'
    });
  }
}
