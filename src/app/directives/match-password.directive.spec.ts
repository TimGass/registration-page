import { ValidationService } from "../services/validation.service";
import { ApiService } from "../services/api.service";

import { uuid } from "uuidv4";

import { TestBed, ComponentFixture } from "@angular/core/testing";
import { Component, OnInit } from "@angular/core";
import { ReactiveFormsModule, FormsModule, FormControl, FormGroup, FormBuilder, Validators } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";
import { UserMock } from '../models/user-mock.model';
import { By } from "@angular/platform-browser";

// Simple test component that will not in the actual app

@Component({
  template: `
    <form [formGroup]="form" novalidate>
      <input
        name="password"
        formControlName="password"
        type="password"
      />
      <input
        name="confirmPassword"
        formControlName="confirmPassword"
        type="password"
      />
    </form>
  `
})
class TestComponent implements OnInit {
  userModal = new UserMock();
  form: FormGroup;
  constructor(private customValidator: ValidationService, private fb: FormBuilder) { }

  ngOnInit() {
    this.form = this.fb.group({
      password: new FormControl("", [Validators.required]),
      confirmPassword: new FormControl("", [Validators.required])
    },
    {
      validator: this.customValidator.MatchPassword('password', 'confirmPassword')
    });
  }
}

describe("MatchPasswordDirective", () => {
  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;
  let password, confirmPassword;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      declarations: [TestComponent],
      imports: [ReactiveFormsModule, FormsModule, HttpClientModule],
      providers: [ValidationService, ApiService, FormBuilder]
    });
    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
    password = fixture.debugElement.query(By.css("input[name=password]"));
    confirmPassword = fixture.debugElement.query(By.css("input[name=confirmPassword]"));
    fixture.detectChanges();
  });

  it("should create component", () => {
    expect(component).toBeDefined();
  });

  it("should have text when typing.", () => {
    component.form.controls.password.setValue("asdedwq");
    component.form.controls.confirmPassword.setValue("wlkvnqon");
    password.nativeElement.dispatchEvent(new Event("input"));
    confirmPassword.nativeElement.dispatchEvent(new Event("input"));
    fixture.detectChanges();
    password = fixture.debugElement.query(By.css("input[name=password]"));
    confirmPassword = fixture.debugElement.query(By.css("input[name=confirmPassword]"));
    expect(password.nativeElement.value).toBe("asdedwq");
    expect(confirmPassword.nativeElement.value).toBe("wlkvnqon");
    const unique = uuid();
    const unique2 = uuid();
    component.form.controls.password.setValue(unique);
    component.form.controls.confirmPassword.setValue(unique2);
    password.nativeElement.dispatchEvent(new Event("input"));
    confirmPassword.nativeElement.dispatchEvent(new Event("input"));
    fixture.detectChanges();
    password = fixture.debugElement.query(By.css("input[name=password"));
    confirmPassword = fixture.debugElement.query(By.css("input[name=confirmPassword]"));
    expect(password.nativeElement.value).toBe(unique);
    expect(confirmPassword.nativeElement.value).toBe(unique2);
  });

  it("should have different passwords give format errors.", () => {
    component.form.controls.password.setValue("");
    password.nativeElement.dispatchEvent(new Event("input"));
    component.form.controls.password.setValue("");
    confirmPassword.nativeElement.dispatchEvent(new Event("input"));
    fixture.detectChanges();
    expect(component.form.controls.password.hasError('required')).toBe(true);
    expect(component.form.controls.confirmPassword.hasError('required')).toBe(true);
    component.form.controls.password.setValue("asdf");
    password.nativeElement.dispatchEvent(new Event("input"));
    component.form.controls.confirmPassword.setValue("Adasadsa21312");
    confirmPassword.nativeElement.dispatchEvent(new Event("input"));
    fixture.detectChanges();

    //passwordMismatch is only applied to the confirmPassword control, so it is the only one tested

    expect(component.form.controls.confirmPassword.hasError('passwordMismatch')).toBe(true);
    password = fixture.debugElement.query(By.css("input[name=password]"));
    confirmPassword = fixture.debugElement.query(By.css("input[name=confirmPassword]"));
    expect(password.nativeElement.value).toBe("asdf");
    expect(confirmPassword.nativeElement.value).toBe("Adasadsa21312");
    component.form.controls.password.setValue("cq0i1c9w1");
    password.nativeElement.dispatchEvent(new Event("input"));
    component.form.controls.confirmPassword.setValue("wmcok34812934");
    confirmPassword.nativeElement.dispatchEvent(new Event("input"));
    fixture.detectChanges();
    expect(component.form.controls.confirmPassword.hasError('passwordMismatch')).toBe(true);
    password = fixture.debugElement.query(By.css("input[name=password]"));
    confirmPassword = fixture.debugElement.query(By.css("input[name=confirmPassword]"));
    expect(password.nativeElement.value).toBe("cq0i1c9w1");
    expect(confirmPassword.nativeElement.value).toBe("wmcok34812934");
    component.form.controls.password.setValue("CorrectPassword12345");
    component.form.controls.confirmPassword.setValue("CorrectPassword12345");
    password.nativeElement.dispatchEvent(new Event("input"));
    confirmPassword.nativeElement.dispatchEvent(new Event("input"));
    fixture.detectChanges();
    expect(component.form.controls.password.errors).toBe(null);
    expect(component.form.controls.confirmPassword.errors).toBe(null);
    password = fixture.debugElement.query(By.css("input"));
    confirmPassword = fixture.debugElement.query(By.css("input"));
    expect(password.nativeElement.value).toBe("CorrectPassword12345");
    expect(confirmPassword.nativeElement.value).toBe("CorrectPassword12345");
    component.form.controls.password.setValue("PasswordCorrect6789");
    component.form.controls.confirmPassword.setValue("PasswordCorrect6789");
    password.nativeElement.dispatchEvent(new Event("input"));
    confirmPassword.nativeElement.dispatchEvent(new Event("input"));
    fixture.detectChanges();
    password = fixture.debugElement.query(By.css("input"));
    confirmPassword = fixture.debugElement.query(By.css("input"));
    expect(password.nativeElement.value).toBe("PasswordCorrect6789");
    expect(confirmPassword.nativeElement.value).toBe("PasswordCorrect6789");
    expect(component.form.controls.password.errors).toBe(null);
    expect(component.form.controls.confirmPassword.errors).toBe(null);
  });
});