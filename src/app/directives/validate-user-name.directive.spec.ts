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
        name="username"
        formControlName="username"
        type="text"
      />
    </form>
  `
})
class TestComponent implements OnInit {
  userModal = new UserMock();
  form: FormGroup;
  constructor(private customValidator: ValidationService) { }

  ngOnInit() {
    this.form = new FormGroup({
      username: new FormControl("", [Validators.required], [this.customValidator.userNameValidator.bind(this.customValidator)])
    });
  }
}

describe("ValidateUsernameDirective", () => {
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
    validationSpy = spyOn(validationService, 'userNameValidator').and.callThrough();
    fixture.detectChanges();
  });

  it("should create component.", () => {
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
    component.form.controls.username.setValue("");
    input.nativeElement.dispatchEvent(new Event("input"));
    fixture.detectChanges();
    expect(validationSpy).not.toHaveBeenCalled();
    component.form.controls.username.setValue("yoloman1");
    input.nativeElement.dispatchEvent(new Event("input"));
    await fixture.whenStable();
    fixture.detectChanges();
    expect(validationSpy).toHaveBeenCalled();
    component.form.controls.username.setValue("yoloman2");
    input.nativeElement.dispatchEvent(new Event("input"));
    await fixture.whenStable();
    fixture.detectChanges();
    expect(validationSpy).toHaveBeenCalled();
  });

  it("should have invalid username format errors.", async () => {
    component.form.controls.username.setValue("");
    input.nativeElement.dispatchEvent(new Event("input"));
    fixture.detectChanges();
    expect(validationSpy).not.toHaveBeenCalled();
    expect(component.form.controls.username.hasError('required')).toBe(true);
    component.form.controls.username.setValue("asdf");
    input.nativeElement.dispatchEvent(new Event("input"));
    fixture.detectChanges();
    expect(validationSpy).toHaveBeenCalled();
    expect(component.form.controls.username.errors).toBeNull();
    input = fixture.debugElement.query(By.css("input"));
    expect(input.nativeElement.value).toBe("asdf");
    component.form.controls.username.setValue("yoloman1");
    input.nativeElement.dispatchEvent(new Event("input"));
    await fixture.whenStable();
    fixture.detectChanges();
    expect(validationSpy).toHaveBeenCalled();
    expect(component.form.controls.username.hasError('userNameNotAvailable')).toBe(true);
    component.form.controls.username.setValue("yoloman2");
    input.nativeElement.dispatchEvent(new Event("input"));
    await fixture.whenStable();
    fixture.detectChanges();
    expect(validationSpy).toHaveBeenCalled();
    expect(component.form.controls.username.hasError('userNameNotAvailable')).toBe(true);
    component.form.controls.username.setValue("wsfwrwq");
    input.nativeElement.dispatchEvent(new Event("input"));
    await fixture.whenStable();
    fixture.detectChanges();
    expect(validationSpy).toHaveBeenCalled();
    expect(component.form.controls.username.errors).toBeNull();
  });
});