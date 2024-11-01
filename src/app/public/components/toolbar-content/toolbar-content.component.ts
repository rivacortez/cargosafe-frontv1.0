import { Component } from '@angular/core';
import {MatToolbar} from "@angular/material/toolbar";
import {MatButton, MatIconButton} from "@angular/material/button";
import {MatIcon} from "@angular/material/icon";
import {LanguageSwitcherComponent} from "../language-switcher/language-switcher.component";
import {Router, RouterLink} from "@angular/router";
import {MatMenu, MatMenuItem, MatMenuTrigger} from "@angular/material/menu";
import {UserApiService} from "../../../iam/service/user-api.service";

@Component({
  selector: 'app-toolbar-content',
  standalone: true,
  imports: [
    MatToolbar,
    MatButton,
    MatIconButton,
    MatIcon,
    LanguageSwitcherComponent,
    RouterLink,
    MatMenu,
    MatMenuTrigger,
    MatMenuItem
  ],
  templateUrl: './toolbar-content.component.html',
  styleUrl: './toolbar-content.component.css'
})
export class ToolbarContentComponent {


  constructor(private router: Router,private userApiService:UserApiService) {}


  navigateToProfile() {
    this.router.navigate(['/profile']);
  }

  logout() {
    this.userApiService.setLogged(false);
    this.userApiService.setUserId(0);
    this.router.navigate(['/login']);
  }
}
