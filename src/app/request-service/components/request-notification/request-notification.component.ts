import {Component, OnInit} from '@angular/core';
import {RequestServiceEntity} from "../../model/request-service.entity";
import {RequestService} from "../../service/request.service";
import {DatePipe, NgForOf} from "@angular/common";
import {MatIcon} from "@angular/material/icon";

@Component({
  selector: 'app-request-notification',
  standalone: true,
  imports: [
    NgForOf,
    DatePipe,
    MatIcon
  ],
  templateUrl: './request-notification.component.html',
  styleUrl: './request-notification.component.css'
})
export class RequestNotificationComponent implements OnInit {
  requests: RequestServiceEntity[] = [];

  constructor(private requestService: RequestService) {}

  ngOnInit(): void {
    this.loadRequests();
  }

  loadRequests(): void {
    this.requestService.getAllRequests().subscribe(
      (data: RequestServiceEntity[]) => {
        this.requests = data;
      },
      error => {
        console.error('Error loading requests:', error);
      }
    );
  }

  viewMore(): void {
    // Implement the logic to view more details
  }



}
