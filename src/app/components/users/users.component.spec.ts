import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientModule } from "@angular/common/http";
import { By } from "@angular/platform-browser";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatCardModule } from "@angular/material/card";
import { NO_ERRORS_SCHEMA } from "@angular/core";

import { UsersComponent } from './users.component';
import { ApiService } from 'src/app/services/api.service';

describe('UsersComponent', () => {
  let component: UsersComponent;
  let fixture: ComponentFixture<UsersComponent>;
  let apiService: ApiService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UsersComponent],
      imports: [
        HttpClientModule,
        MatProgressSpinnerModule,
        MatCardModule
      ],
      providers: [ApiService],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(async(() => {
    fixture = TestBed.createComponent(UsersComponent);
    component = fixture.componentInstance;
    apiService = TestBed.get(ApiService);
    component.ngOnInit();
  }));

  it('should create.', () => {
    expect(component).toBeTruthy();
  });

  it('should have users and display them.', () => {
    fixture.detectChanges();
    expect(component.users.length).toBeGreaterThan(0);
    let cards = fixture.debugElement.queryAll(By.css("mat-card.users-card"));
    let back = fixture.debugElement.query(
      By.css("mat-card.users-footer > button.back-page")
    );
    let first = fixture.debugElement.query(
      By.css("mat-card.users-footer > button.first-page")
    );
    let next = fixture.debugElement.query(
      By.css("mat-card.users-footer > button.next-page")
    );
    let last = fixture.debugElement.query(
      By.css("mat-card.users-footer > button.last-page")
    );
    expect(back).toBeTruthy();
    expect(first).not.toBeTruthy();
    expect(next).not.toBeTruthy();
    expect(last).not.toBeTruthy();
    apiService.sendGetRequest(component.pageInfo.page).toPromise().then(payload => {
      for(var i = 0; i < component.users.length; i++) {
        expect(cards[i].nativeElement).toBeTruthy();
        expect(cards[i].query(By.css("mat-card-title")).nativeElement.textContent.trim()).toEqual(payload.body[i].username);
        expect(cards[i].query(By.css("mat-card-subtitle")).nativeElement.textContent.trim()).toEqual(payload.body[i].email);
        expect(cards[i].queryAll(By.css("p"))[0].nativeElement.textContent.trim()).toContain(payload.body[i].password);
        expect(cards[i].queryAll(By.css("p"))[1].nativeElement.textContent.trim()).toContain(payload.body[i].id);
        expect(payload.body[i]).toEqual(jasmine.objectContaining(component.users[i]));
      }
    });
  });

  it('should change users and display them correctly on hitting back.', async () => {
    fixture.detectChanges();
    expect(component.users.length).toBeGreaterThan(0);
    const tempBack = component.pageInfo.prev;
    let cards = fixture.debugElement.queryAll(
      By.css("mat-card.users-card")
    );
    let back = fixture.debugElement.query(
      By.css("mat-card.users-footer > button.back-page")
    );
    let first = fixture.debugElement.query(
      By.css("mat-card.users-footer > button.first-page")
    );
    let next = fixture.debugElement.query(
      By.css("mat-card.users-footer > button.next-page")
    );
    let last = fixture.debugElement.query(
      By.css("mat-card.users-footer > button.last-page")
    );
    // Ridiculously short timeout. I know of no current way to spy on our service without taking over button execution ourselves,
    // and it is necessary for button to be clickable. We do this to wait for the service to be called.
    await new Promise(resolve => setTimeout(() => resolve(), 500));
    back.nativeElement.click();
    await fixture.whenStable();
    fixture.detectChanges();
    back = fixture.debugElement.query(
      By.css("mat-card.users-footer > button.back-page")
    );
    first = fixture.debugElement.query(
      By.css("mat-card.users-footer > button.first-page")
    );
    next = fixture.debugElement.query(
      By.css("mat-card.users-footer > button.next-page")
    );
    last = fixture.debugElement.query(
      By.css("mat-card.users-footer > button.last-page")
    );
    cards = fixture.debugElement.queryAll(By.css("mat-card.users-card"));
    if (component.pageInfo.page === component.pageInfo.first) {
      expect(back).not.toBeTruthy();
      expect(first).not.toBeTruthy();
      expect(last).not.toBeTruthy();
    }
    expect(next).toBeTruthy();
    apiService
      .sendGetRequest(tempBack)
      .toPromise()
      .then(payload => {
        for (var i = 0; i < component.users.length; i++) {
          expect(cards[i].nativeElement).toBeTruthy();
          expect(
            cards[i]
              .query(By.css("mat-card-title"))
              .nativeElement.textContent.trim()
          ).toEqual(payload.body[i].username);
          expect(
            cards[i]
              .query(By.css("mat-card-subtitle"))
              .nativeElement.textContent.trim()
          ).toEqual(payload.body[i].email);
          expect(
            cards[i]
              .queryAll(By.css("p"))[0]
              .nativeElement.textContent.trim()
          ).toContain(payload.body[i].password);
          expect(
            cards[i]
              .queryAll(By.css("p"))[1]
              .nativeElement.textContent.trim()
          ).toContain(payload.body[i].id);
          expect(payload.body[i]).toEqual(
            jasmine.objectContaining(component.users[i])
          );
        }
      });
  });
});
