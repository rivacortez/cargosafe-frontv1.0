import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable, switchMap, tap} from "rxjs";
import {UserApiService} from "./user-api.service";

@Injectable({
  providedIn: 'root'
})
export class AuthenticationApiService {
  private baseUrl = 'http://localhost:3000';

  constructor(private http: HttpClient, private userApiService: UserApiService) {}

  signUp(email: string, password: string, role: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/authentication`, { email, password, role });
  }

  signIn(email: string, password: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/authentication`, { email, password }).pipe(
      switchMap((authResponse: any) => {
        return this.userApiService.getByEmail(email).pipe(
          tap((userResponse: any) => {
            this.userApiService.setUserId(userResponse.id);
          })
        );
      })
    );
  }
}
