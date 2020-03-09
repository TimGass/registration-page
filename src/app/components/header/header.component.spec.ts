import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatButtonModule } from "@angular/material/button";
import { By } from "@angular/platform-browser";

import { AppRoutingModule } from "../../app-routing.module";
import { HeaderComponent } from './header.component';
import { Router } from '@angular/router';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let router;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HeaderComponent ],
      imports: [ AppRoutingModule, MatToolbarModule, MatButtonModule ]
    })
    .compileComponents();
  }));

  beforeEach(async(() => {
    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    router = TestBed.get(Router);
    component.ngOnInit();
    fixture.whenStable();
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should change names depeding on the route.', async () => {
    let register = fixture.debugElement.query(By.css("a[href='/register']"));
    register.nativeElement.click();
    await fixture.whenStable();
    fixture.detectChanges();
    expect(router.url).toBe('/register');
    let users = fixture.debugElement.query(By.css("a[href='/users']"));
    users.nativeElement.click();
    await fixture.whenStable();
    expect(router.url).toBe('/users');
  });

  it('should display \'Registration\' on routes that aren\'t \'/register\'', async () => {
    let users = fixture.debugElement.query(By.css("a[href='/users']"));
    users.nativeElement.click();
    await fixture.whenStable();
    expect(router.url).toBe("/users");
    let register = fixture.debugElement.query(By.css("a[href='/register']"));
    expect(register.nativeElement.textContent.trim()).toBe("Registration");
  });

  it('should display \'Users\' on routes that aren\'t \'users\'',  async () => {
    let register = fixture.debugElement.query(
      By.css("a[href='/register']")
    );
    register.nativeElement.click();
    await fixture.whenStable();
    fixture.detectChanges();
    expect(router.url).toBe("/register");
    let users = fixture.debugElement.query(By.css("a[href='/users']"));
    expect(users.nativeElement.textContent.trim()).toBe("Users");
  });
});
