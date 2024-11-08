import { Component } from '@angular/core';
import {MatCard, MatCardContent, MatCardTitle} from "@angular/material/card";
import {FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatError, MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {NgIf} from "@angular/common";
import {MatButton} from "@angular/material/button";
import { MAT_DATE_LOCALE } from '@angular/material/core';
import {DateAdapter} from "chart.js";
import {Router} from "@angular/router";
import {MatSnackBar} from "@angular/material/snack-bar";
import {AuthenticationApiService} from "../../../service/authentication-api.service";
import {CompanyApiService} from "../../../service/company-api.service";
import {UserApiService} from "../../../service/user-api.service";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";

@Component({
  selector: 'app-register-company',
  standalone: true,
  imports: [
    MatCard,
    MatCardTitle,
    MatCardContent,
    ReactiveFormsModule,
    MatFormField,
    MatInput,
    NgIf,
    MatButton,
    MatLabel,
    MatError
  ],
  templateUrl: './register-company.component.html',
  styleUrl: './register-company.component.css',
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'es-PE' }
  ]
})
export class RegisterCompanyComponent {
  registerForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private snackBar: MatSnackBar,
    private authenticationApiService: AuthenticationApiService,
    private userApiService: UserApiService,
    private companyApiService: CompanyApiService
  ) {
    this.registerForm = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      phone: ['', Validators.required],
      location: ['', Validators.required],
      description: ['']
    });
  }

  onSubmit() {
    if (this.registerForm.invalid) {
      this.snackBar.open('Please complete all required fields.', 'Close', { duration: 3000 });
      return;
    }

    const { email, password, name, phone, location, description } = this.registerForm.value;

    this.registerForm.disable();

    this.authenticationApiService.signUp(email, password, 'ROLE_COMPANY').subscribe({
      next: (response: any) => {
        const userId = response.id;
        const user = {
          id: userId,
          name,
          lastname: '',
          email,
          phone,
          password,
          roleId: 2
        };

        this.userApiService.create(user).subscribe({
          next: () => {
            const company = { id: 0, name, location, description, userId };
            this.companyApiService.create(company).subscribe({
              next: () => {
                this.router.navigateByUrl('/login');
                this.snackBar.open(`Welcome ${name}`, 'Close', { duration: 2000 });
              },
              error: (error) => {
                this.snackBar.open('Error registering the company', 'Close', { duration: 5000 });
                console.error(error);
                this.registerForm.enable();
              }
            });
          },
          error: (error) => {
            this.snackBar.open('Error registering the user', 'Close', { duration: 5000 });
            console.error(error);
            this.registerForm.enable();
          }
        });
      },
      error: () => {
        this.snackBar.open('Error registering the user', 'Close', { duration: 3000 });
        this.registerForm.enable();
      }
    });

  }

  goBack() {
    window.history.back();
  }
}
