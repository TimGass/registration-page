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
        name="password"
        formControlName="password"
        type="password"
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
      password: new FormControl("", [Validators.required, this.customValidator.patternValidator().bind(this.customValidator)])
    });
  }
}

describe("PasswordPatternDirective", () => {
  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;
  let input;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      declarations: [TestComponent],
      imports: [ReactiveFormsModule, FormsModule, HttpClientModule],
      providers: [ValidationService, ApiService]
    });
    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
    input = fixture.debugElement.query(By.css("input"));
    fixture.detectChanges();
  });

  it("should create component", () => {
    expect(component).toBeDefined();
  });

  it("should have text when typing.", () => {
    component.form.controls.password.setValue("asdedwq");
    input.nativeElement.dispatchEvent(new Event("input"));
    fixture.detectChanges();
    input = fixture.debugElement.query(By.css("input"));
    expect(input.nativeElement.value).toBe("asdedwq");
    const unique = uuid();
    component.form.controls.password.setValue(unique);
    input.nativeElement.dispatchEvent(new Event("input"));
    fixture.detectChanges();
    input = fixture.debugElement.query(By.css("input"));
    expect(input.nativeElement.value).toBe(unique);
  });

  it("should have invalid password format errors.", () => {
    // Pattern is currently 8 characters, 1 capitalized, 1 uncapitalized, and 1 number.
    component.form.controls.password.setValue("");
    input.nativeElement.dispatchEvent(new Event("input"));
    fixture.detectChanges();
    expect(component.form.controls.password.hasError('required')).toBe(true);
    component.form.controls.password.setValue("asdf");
    input.nativeElement.dispatchEvent(new Event("input"));
    fixture.detectChanges();
    expect(component.form.controls.password.hasError('invalidPassword')).toBe(true);
    input = fixture.debugElement.query(By.css("input"));
    expect(input.nativeElement.value).toBe("asdf");
    component.form.controls.password.setValue("asfasfa23");
    input.nativeElement.dispatchEvent(new Event("input"));
    fixture.detectChanges();
    expect(component.form.controls.password.hasError('invalidPassword')).toBe(true);
    input = fixture.debugElement.query(By.css("input"));
    expect(input.nativeElement.value).toBe("asfasfa23");
    component.form.controls.password.setValue("CorrectPassword12345");
    input.nativeElement.dispatchEvent(new Event("input"));
    fixture.detectChanges();
    expect(component.form.controls.password.errors).toBe(null);
    input = fixture.debugElement.query(By.css("input"));
    expect(input.nativeElement.value).toBe("CorrectPassword12345");
    component.form.controls.password.setValue("PasswordCorrect6789");
    input.nativeElement.dispatchEvent(new Event("input"));
    fixture.detectChanges();
    input = fixture.debugElement.query(By.css("input"));
    expect(input.nativeElement.value).toBe("PasswordCorrect6789");
    expect(component.form.controls.password.errors).toBe(null); 
  });
});