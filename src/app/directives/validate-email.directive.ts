import { Directive, forwardRef } from "@angular/core";
import {
  Validator,
  FormControl,
  NG_ASYNC_VALIDATORS,
} from "@angular/forms";
import { ValidationService } from "../services/validation.service";
import { Observable } from "rxjs";

@Directive({
  selector: "[appValidateEmail][ngModel]",
  providers: [
    {
      provide: NG_ASYNC_VALIDATORS,
      useExisting: forwardRef(() => ValidateEmailDirective),
      multi: true
    }
  ]
})

export class ValidateEmailDirective implements Validator {
  constructor(private customValidator: ValidationService) {
  }

  validate(
    control: FormControl
  ): Promise<{ [key: string]: any }> | Observable<{ [key: string]: any }> {
    return this.customValidator.userEmailValidator(control);
  }
}
