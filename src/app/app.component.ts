import { Component } from '@angular/core';
import { DataService } from "./services/data.service";
import { LoaderService } from "./services/loader.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'kla-dev-day-web-worker';

  constructor(
    public dataService: DataService,
    public loaderService: LoaderService,
  ) {
  }
}
