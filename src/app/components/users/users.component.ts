import { Component, OnInit } from '@angular/core';
import { ApiService } from "../../services/api.service";

import { User } from '../../models/user.model';



@Component({
  selector: "app-users",
  templateUrl: "./users.component.html",
  styleUrls: ["./users.component.scss"]
})
export class UsersComponent implements OnInit {
  users = [];
  pageInfo = {
    page: "http://localhost:3000/users?_page=1&_limit=4",
    first: undefined,
    last: undefined,
    prev: undefined,
    next: undefined
  };

  constructor(private apiService: ApiService) {}

  handlePage(instruction) {
    let url;
    if (instruction === 'next') {
      url = this.pageInfo.next;
    }
    else if (instruction === 'back') {
      url = this.pageInfo.prev;
    }
    else if (instruction === 'first') {
      url = this.pageInfo.first;
    }
    else if (instruction === 'last') {
      url = this.pageInfo.last;
    }
    this.pageInfo.page = url;
    this.apiService
      .sendGetRequest(url)
      .subscribe((res: any) => {
        this.parseLinkHeader(res.headers.get("Link"));
        let users = res.body.map(item => Object.setPrototypeOf(item, User.prototype));
        this.users = users;
      });
  }

  ngOnInit() {
    this.apiService.sendGetRequest(this.pageInfo.page).subscribe((res: any) => {
      this.parseLinkHeader(res.headers.get("Link"));
      this.pageInfo.page = this.pageInfo.last;
      this.apiService
        .sendGetRequest(this.pageInfo.last)
        .subscribe((res: any) => {
          this.parseLinkHeader(res.headers.get("Link"));
          let users = res.body.map(item => Object.setPrototypeOf(item, User.prototype));
          this.users = users;
        });
    });
  }

  parseLinkHeader(header) {
    if (header.length == 0) {
      return;
    }

    let parts = header.split(",");
    var links = {};
    parts.forEach(p => {
      let section = p.split(";");
      var url = section[0].replace(/<(.*)>/, "$1").trim();
      var name = section[1].replace(/rel="(.*)"/, "$1").trim();
      links[name] = url;
    });
    Object.keys(this.pageInfo).forEach(item => {
      if (item !== "page") {
        this.pageInfo[item] = undefined;
      }
    });
    
    this.pageInfo.first = links["first"];
    this.pageInfo.last = links["last"];
    this.pageInfo.prev = links["prev"];
    this.pageInfo.next = links["next"];
  }
}
