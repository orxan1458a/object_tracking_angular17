import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { SnackBarComponent } from 'src/app/core/snack-bar/snack-bar.component';
import { UserAuthService } from '../../authentication/_services/user-auth.service';
import { UserService } from '../../authentication/_services/user.service';
import { catchError } from 'rxjs';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class LoginComponent {
  // NgForm = NgForm; //this one solve my problem...initialization and declaration

  constructor(
    private userService: UserService,
    private userAuthService: UserAuthService,
    private router: Router,
    private _snackBar: MatSnackBar

  ) {

  }
  ngOnInit(): void {


    let eyeicon = document.getElementById("eyeicon") as HTMLImageElement;
    let password = document.getElementById("userPassword") as HTMLInputElement;
    const width = window.innerWidth;
    if (width < 800) {
      eyeicon.addEventListener("click", () => {
        if (password.type == "password") {
          password.type = "text";
          eyeicon.src = "../../../../assets/images/visibility.png";
        }
        else {
          password.type = "password";
          eyeicon.src = "../../../../assets/images/visible.png";
        }
      })
    }
    else {
      eyeicon.addEventListener("mousedown", () => {
        password.type = "text";
        eyeicon.src = "../../../../assets/images/visibility.png";
      })
      eyeicon.addEventListener("mouseup", () => {
        password.type = "password";
        eyeicon.src = "../../../../assets/images/visible.png";
      })
    }
  }


  login(loginForm: NgForm) {
    if (loginForm.value.userName.length == 0 || loginForm.value.userPassword.length == 0) {
      this._snackBar.openFromComponent(SnackBarComponent, {
        duration: 3 * 1000,
        data: {
          title: 'fill_cell'
        }
      });
    }
    else {

      this.userService.login(loginForm.value)
      .pipe(catchError(
        
        (err)=>{
          console.log(err)
          if(err.status===500){
            this._snackBar.openFromComponent(SnackBarComponent, {
              duration: 3 * 1000,
              data: {
                title: 'username_or_password_invalid',
              }
            });
          }
          else if(err.status===401 && err.error==null){
            this._snackBar.openFromComponent(SnackBarComponent, {
              duration: 3 * 1000,
              data: {
                title: 'username_or_password_invalid',
              }
            });
          }
          else if(err.status===401 && err.error.message!=null && err.error.message=='many_login_attempt_error'){
            this._snackBar.openFromComponent(SnackBarComponent, {
              duration: 3 * 1000,
              data: {
                title: 'many_login_attempt_error',
              }
            });
          }
          
          console.log(err)
          return err;
            
        }
      ))
      .subscribe(
        (response: any) => {
          this.userAuthService.setRoles(response.user.role);
          this.userAuthService.setToken(response.jwtToken);
          this.userAuthService.setUserId(response.user.id);
          const role = response.user.role[0].roleName;


          // if (role === 'Admin') {
          //   this.router.navigate(['/admin']);
          // } else if (role === 'User') {
          //   this.router.navigate(['/']);
          // } else {
          //   alert('yanlisdi')
          //   this.router.navigate(['/error']);
          // }

          this.router.navigate(['/']);

        }        
      );
    }
  }
}
