import { Injectable } from "@angular/core";
import { ValidatorFn, AbstractControl, FormControl } from "@angular/forms";
import { FormGroup } from "@angular/forms";

import { ApiService } from "./api.service";
import { User } from "../models/user.model";

@Injectable({
  providedIn: "root"
})
export class ValidationService {
  private users = [];
  constructor(private apiService: ApiService) { return this; }
  
  patternValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
      if (!control.value) {
        return null;
      }
      const regex = new RegExp("^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$");
      const valid = regex.test(control.value);
      return valid ? null : { invalidPassword: true };
    };
  }

  MatchPassword(password: string, confirmPassword: string) {
    return (formGroup: FormGroup) => {
      const passwordControl = formGroup.controls[password];
      const confirmPasswordControl = formGroup.controls[confirmPassword];

      if (!passwordControl || !confirmPasswordControl) {
        return null;
      }

      if (
        confirmPasswordControl.errors &&
        !confirmPasswordControl.errors.passwordMismatch
      ) {
        return null;
      }

      if (passwordControl.value !== confirmPasswordControl.value) {
        confirmPasswordControl.setErrors({ passwordMismatch: true });
      } else {
        confirmPasswordControl.setErrors(null);
      }
    };
  }

  userNameValidator(userControl: AbstractControl) {
    return this.validateUserName(userControl.value).then(result => {
      if(result) {
        return { userNameNotAvailable: true };
      }
      else {
        return null;
      }
    });
  }

  validateUserName(userName: string) {
    return new Promise(resolve => {
        this.apiService
          .getQuery(`username=${userName}`)
          .subscribe((data: any[]) => {
            let users = data.map(item => Object.assign(item, User));
            this.users = users;
            return resolve(
              this.users.findIndex(user => user.username === userName) !== -1
            );
          });
    });
  }

  userEmailValidator(userControl: AbstractControl) {
    return this.validateEmail(userControl.value).then(result => {
      if(result) {
        return { userEmailNotAvailable: true };
      }
      else {
        return null;
      }
    });
  }

  validateEmail(userEmail: string) {
    return new Promise(resolve => {
        this.apiService.getQuery(`email=${userEmail}`).subscribe((data: any[]) => {
        let users = data.map(item => Object.assign(item, User));
        this.users = users;
        return resolve(this.users.findIndex(user => user.email === userEmail) !== -1);
      });
    });
  }
}
