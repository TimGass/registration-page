import { Component, OnInit } from '@angular/core';
import { NgForm } from "@angular/forms";
import { Router } from "@angular/router";

import { uuid } from 'uuidv4';

import { User } from '../../models/user.model';
import { UserMock } from '../../models/user-mock.model';
import { ApiService } from '../../services/api.service';

@Component({
  selector: "app-registration",
  templateUrl: "./registration.component.html",
  styleUrls: ["./registration.component.scss"]
})
export class RegistrationComponent implements OnInit {
  private user: User;
  userModal = new UserMock();
  constructor(private apiService: ApiService, private router: Router) {}

  onSubmit(form: NgForm) {
    if(form.valid) {
      this.user = new User({
        id: uuid(),
        email: form.value.email,
        username: form.value.username,
        password: form.value.password
      });
      this.apiService.sendPostRequest(this.user).subscribe((data: any[]) => {
        this.router.navigate(["/users"]);
      });
    }
    else {
      alert('Form could not be submitted to API-Service!');
    }
  }

  ngOnInit(): void {}
}
