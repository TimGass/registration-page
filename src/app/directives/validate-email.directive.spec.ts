import { ValidationService } from "../services/validation.service";
import { ApiService } from "../services/api.service";

import { uuid } from "uuidv4";

import { TestBed, ComponentFixture } from "@angular/core/testing";
import { Component, OnInit } from "@angular/core";
import { ReactiveFormsModule, FormsModule, FormControl, FormGroup, Validators } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";
import { UserMock } from '../models/user-mock.model';
import { By } from "@angular/platform-browser";

// Simple test component that will not in the actual app

@Component({
  template: `
    <form [formGroup]="form" novalidate>
      <input
        name="email"
        formControlName="email"
        type="text"
      />
    </form>
  `
})
class TestComponent implements OnInit {
  userModal = new UserMock();
  form: FormGroup;
  constructor(private customValidator: ValidationService) {}

  ngOnInit() {
    this.form = new FormGroup({
      email: new FormControl("", [Validators.required, Validators.email], [this.customValidator.userEmailValidator.bind(this.customValidator)])
    });
  }
}

describe("ValidateEmailDirective", () => {
  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;
  let input;
  let validationService: ValidationService;
  let validationSpy;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      declarations: [TestComponent],
      imports: [ReactiveFormsModule, FormsModule, HttpClientModule],
      providers: [ValidationService, ApiService]
    });

    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
    input = fixture.debugElement.query(By.css("input"));
    validationService = input.injector.get(ValidationService);
    validationSpy = spyOn(validationService, 'userEmailValidator').and.callThrough();
    fixture.detectChanges();
  });

  it("should create component", () => {
    expect(component).toBeDefined();
  });

  it("should have text when typing.", () => {
    input.nativeElement.value = "asdedwq";
    input.nativeElement.dispatchEvent(new Event("input"));
    fixture.detectChanges();
    input = fixture.debugElement.query(By.css("input"));
    expect(input.nativeElement.value).toBe("asdedwq");
    const unique = uuid();
    input.nativeElement.value = unique;
    input.nativeElement.dispatchEvent(new Event("input"));
    fixture.detectChanges(); 
    input = fixture.debugElement.query(By.css("input"));
    expect(input.nativeElement.value).toBe(unique);
  });

  it("should call service on input.", async () => {
    component.form.controls.email.setValue("");
    input.nativeElement.dispatchEvent(new Event("input"));
    fixture.detectChanges();
    expect(validationSpy).not.toHaveBeenCalled();
    component.form.controls.email.setValue("adfldk");
    input.nativeElement.dispatchEvent(new Event("input"));
    fixture.detectChanges();
    expect(validationSpy).not.toHaveBeenCalled();
    component.form.controls.email.setValue("asdf");
    input.nativeElement.dispatchEvent(new Event("input"));
    fixture.detectChanges();
    expect(validationSpy).not.toHaveBeenCalled();
    component.form.controls.email.setValue("yolo2@swag.com");
    input.nativeElement.dispatchEvent(new Event("input"));
    await fixture.whenStable();
    fixture.detectChanges();
    expect(validationSpy).toHaveBeenCalled();
    component.form.controls.email.setValue("yolo2@swag.com");
    input.nativeElement.dispatchEvent(new Event("input"));
    await fixture.whenStable();
    fixture.detectChanges();
    expect(validationSpy).toHaveBeenCalled();
  });

  it("should have invalid email format errors.", async () => {
    component.form.controls.email.setValue("");
    input.nativeElement.dispatchEvent(new Event("input"));
    fixture.detectChanges();
    expect(validationSpy).not.toHaveBeenCalled();
    expect(component.form.controls.email.hasError('required')).toBe(true);
    component.form.controls.email.setValue("asdf");
    input.nativeElement.dispatchEvent(new Event("input"));
    fixture.detectChanges();
    expect(validationSpy).not.toHaveBeenCalled();
    expect(component.form.controls.email.hasError('email')).toBe(true);
    input = fixture.debugElement.query(By.css("input"));
    expect(input.nativeElement.value).toBe("asdf");
    component.form.controls.email.setValue("yolo@swag.com");
    input.nativeElement.dispatchEvent(new Event("input"));
    await fixture.whenStable();
    fixture.detectChanges();
    expect(validationSpy).toHaveBeenCalled();
    expect(component.form.controls.email.hasError('userEmailNotAvailable')).toBe(true);
    component.form.controls.email.setValue("yolo2@swag.com");
    input.nativeElement.dispatchEvent(new Event("input"));
    await fixture.whenStable();
    fixture.detectChanges();
    expect(validationSpy).toHaveBeenCalled();
    expect(component.form.controls.email.hasError('userEmailNotAvailable')).toBe(true);
    component.form.controls.email.setValue("wsfwrwq@swag.com");
    input.nativeElement.dispatchEvent(new Event("input"));
    await fixture.whenStable();
    fixture.detectChanges();
    expect(validationSpy).toHaveBeenCalled();
    expect(component.form.controls.email.errors).toBeNull();
  });
});