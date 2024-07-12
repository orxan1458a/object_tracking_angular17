import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Router } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { UserAuthService } from '../_services/user-auth.service';
import { Injectable } from '@angular/core';

import { JwtHelperService } from '@auth0/angular-jwt';
import { SnackBarComponent } from 'src/app/core/snack-bar/snack-bar.component';
import { MatSnackBar } from '@angular/material/snack-bar';

const helper = new JwtHelperService();

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private userAuthService: UserAuthService,
    private router: Router,
    private _snackBar: MatSnackBar) { }

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (req.headers.get('No-Auth') === 'True') {
      return next.handle(req.clone());
    }

    const token = this.userAuthService.getToken();
    const language = localStorage.getItem('language');

    req = this.addToken(req, token, language);
    console.log(req)
    return next.handle(req).pipe(
      catchError(
        (err) => {
          console.log(err, err.error);
          if (!this.isLoggedIn()) {
            this.userAuthService.clear();
            window.location.reload();
          }
          if (err.status === 401) {
            this.userAuthService.clear()
            // window.location.reload();
          } else if (err.status === 403) {
            this.router.navigate(['/login']);
          }
          else if (err.status === 404 && err.error.message && err.error.message == 'current_password_dont_match') {
            alert("Current password dont match")
          }
          else if (err.status == 409) {
            const error = JSON.parse(err.error);
            if (error.message != null) {
              this._snackBar.openFromComponent(SnackBarComponent, {
                duration: 3 * 1000,
                data: {
                  title: error.message,
                }
              });
            }


            return throwError(err.error)
          }
          return throwError("Some thing is wrong");
        }
      )
    );
  }


  private addToken(request: HttpRequest<any>, token: string, language: any) {
    return request.clone(
      {
        setHeaders: {
          Authorization: `Bearer ${token}`,
          Language: language
        }
      }
    );
  }

  isLoggedIn(): boolean {
    const token = localStorage.getItem('jwtToken');
    return !helper.isTokenExpired(token);
  }
}
