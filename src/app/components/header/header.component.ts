import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.scss"]
})
export class HeaderComponent implements OnInit {
  public name;
  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.name =
      this.route.snapshot.url
        .toString()
        .charAt(0)
        .toUpperCase() + this.route.snapshot.url.toString().substring(1);
  }
}
