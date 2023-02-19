import { Component } from "@angular/core";
import { DataService } from "../data.service";

@Component({
  // tslint:disable-next-line: component-selector
  selector: "main-nav",
  templateUrl: "./main-nav.component.html",
  styleUrls: ["./main-nav.component.scss"],
})
export class MainNavComponent {
  constructor(
    public dataService: DataService
  ) {

  }

  public loadData(size: "small" | "medium" | "large" | "excessive"): void {
    this.dataService.load(size);
  }

  public doWork(): void {
    this.dataService.process();
  }
}
