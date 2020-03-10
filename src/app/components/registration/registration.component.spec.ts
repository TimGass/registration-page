import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { HttpClientModule } from "@angular/common/http";
import { By } from "@angular/platform-browser";
import { MatCardModule } from "@angular/material/card";
import { NO_ERRORS_SCHEMA } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MatInputModule } from "@angular/material/input";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatButtonModule } from "@angular/material/button";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

import { RegistrationComponent } from './registration.component';
import { ValidationService } from "src/app/services/validation.service";
import { AppRoutingModule } from "../../app-routing.module";
import { PasswordPatternDirective } from "../../directives/password-pattern.directive";
import { MatchPasswordDirective } from "../../directives/match-password.directive";
import { ValidateUserNameDirective } from "../../directives/validate-user-name.directive";
import { ValidateEmailDirective } from "../../directives/validate-email.directive";

describe('RegistrationComponent', () => {
  let component: RegistrationComponent;
  let fixture: ComponentFixture<RegistrationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        RegistrationComponent,
        PasswordPatternDirective,
        MatchPasswordDirective,
        ValidateUserNameDirective,
        ValidateEmailDirective
      ],
      imports: [
        HttpClientModule,
        MatCardModule,
        MatButtonModule,
        MatFormFieldModule,
        MatInputModule,
        FormsModule,
        AppRoutingModule,
        BrowserAnimationsModule
      ],
      providers: [ValidationService],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(async(() => {
    fixture = TestBed.createComponent(RegistrationComponent);
    component = fixture.componentInstance;
    fixture.whenStable();
  }));

  it('should create.', () => {
    expect(component).toBeTruthy();
  });

  it('should get directive errors on email input.', async () => {
    fixture.detectChanges();
    let email = fixture.debugElement.query(By.css("input[name=email]"));
    email.nativeElement.value = "";
    email.nativeElement.dispatchEvent(new Event("input"));
    await fixture.whenStable();
    fixture.detectChanges();
    email = fixture.debugElement.query(By.css("input[name=email]"));
    expect(email.references.email.control.errors.required).toBe(true);
    email.nativeElement.value = "asfga";
    email.nativeElement.dispatchEvent(new Event("input"));
    await fixture.whenStable();
    fixture.detectChanges();
    email = fixture.debugElement.query(By.css("input[name=email]"));
    //For some reason, ngIf does not display in jasmine. For now, I will leave that to the e2e tests.
    expect(email.references.email.control.errors.email).toBe(true);
    email = fixture.debugElement.query(By.css("input[name=email]"));
    email.nativeElement.value = "yolo@swag.com";
    email.nativeElement.dispatchEvent(new Event("input"));
    await fixture.whenStable();
    fixture.detectChanges();
    email = fixture.debugElement.query(By.css("input[name=email]"));
    expect(email.references.email.control.errors.userEmailNotAvailable).toBe(true);
    email = fixture.debugElement.query(By.css("input[name=email]"));
    email.nativeElement.value = "dsfqf112@asda.com";
    email.nativeElement.dispatchEvent(new Event("input"));
    await fixture.whenStable();
    fixture.detectChanges();
    email = fixture.debugElement.query(By.css("input[name=email]"));
    expect(email.references.email.control.errors).toBe(null);
  });

  it("should get directive errors on invalid username input.", async () => {
    fixture.detectChanges();
    let username = fixture.debugElement.query(By.css("input[name=username]"));
    username.nativeElement.value = "";
    username.nativeElement.dispatchEvent(new Event("input"));
    await fixture.whenStable();
    fixture.detectChanges();
    username = fixture.debugElement.query(By.css("input[name=username]"));
    expect(username.references.username.control.errors.required).toBe(true);
    username.nativeElement.value = "yoloman1";
    username.nativeElement.dispatchEvent(new Event("input"));
    await fixture.whenStable();
    fixture.detectChanges();
    username = fixture.debugElement.query(By.css("input[name=username]"));
    expect(username.references.username.control.errors.userNameNotAvailable).toBe(
      true
    );
    username.nativeElement.value = "fagkakad212";
    username.nativeElement.dispatchEvent(new Event("input"));
    await fixture.whenStable();
    fixture.detectChanges();
    username = fixture.debugElement.query(By.css("input[name=username]"));
    expect(username.references.username.control.errors).toBe(
      null
    );
  });

  it("should get directive errors on invalid password input.", async () => {
    fixture.detectChanges();
    let password = fixture.debugElement.query(By.css("input[name=password]"));
    password.nativeElement.value = "";
    password.nativeElement.dispatchEvent(new Event("input"));
    await fixture.whenStable();
    fixture.detectChanges();
    password = fixture.debugElement.query(By.css("input[name=password]"));
    expect(password.references.password.control.errors.required).toBe(true);
    password.nativeElement.value = "yolo";
    password.nativeElement.dispatchEvent(new Event("input"));
    await fixture.whenStable();
    fixture.detectChanges();
    password = fixture.debugElement.query(By.css("input[name=password]"));
    expect(
      password.references.password.control.errors.invalidPassword
    ).toBe(true);
    //8 characters, min: 1 number, 1 cap, 1 uncap
    password.nativeElement.value = "Yoloooo1";
    password.nativeElement.dispatchEvent(new Event("input"));
    await fixture.whenStable();
    fixture.detectChanges();
    password = fixture.debugElement.query(By.css("input[name=password]"));
    expect(
      password.references.password.control.errors
    ).toBe(null);
  });

  it("should get directive errors on invalid confirm password input.", async () => {
    fixture.detectChanges();
    let password = fixture.debugElement.query(By.css("input[name=password]"));
    let confirmPassword = fixture.debugElement.query(By.css("input[name=confirmPassword]"));
    confirmPassword.nativeElement.value = "";
    confirmPassword.nativeElement.dispatchEvent(new Event("input"));
    await fixture.whenStable();
    fixture.detectChanges();
    confirmPassword = fixture.debugElement.query(By.css("input[name=confirmPassword]"));
    expect(confirmPassword.references.confirmPassword.control.errors.required).toBe(true);
    password.nativeElement.value = "Yolo1";
    password.nativeElement.dispatchEvent(new Event("input"));
    confirmPassword.nativeElement.value = "yolo";
    confirmPassword.nativeElement.dispatchEvent(new Event("input"));
    await fixture.whenStable();
    fixture.detectChanges();
    confirmPassword = fixture.debugElement.query(By.css("input[name=confirmPassword]"));
    expect(confirmPassword.references.confirmPassword.control.errors.passwordMismatch).toBe(
      true
    );
    password.nativeElement.value = "yolo";
    password.nativeElement.dispatchEvent(new Event("input"));
    confirmPassword.nativeElement.value = "yolo";
    confirmPassword.nativeElement.dispatchEvent(new Event("input"));
    await fixture.whenStable();
    fixture.detectChanges();
    confirmPassword = fixture.debugElement.query(By.css("input[name=confirmPassword]"));
    expect(confirmPassword.references.confirmPassword.control.errors).toBe(
      null
    );
  });

    it("should have the submit button loaded on the page.", async () => {
      fixture.detectChanges();
      let submitEl = fixture.debugElement.query(By.css("button[type=submit]"));
      expect(submitEl).toBeTruthy();
    });
});
