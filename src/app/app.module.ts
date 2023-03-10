import { HttpClientModule } from "@angular/common/http";
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatListModule } from "@angular/material/list";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { MatSortModule } from "@angular/material/sort";
import { MatTableModule } from "@angular/material/table";
import { MatToolbarModule } from "@angular/material/toolbar";
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DataTableComponent } from './components/data-table/data-table.component';
import { MainNavComponent } from './components/main-nav/main-nav.component';
import { CrossTabRelayService } from "./services/cross-tab-relay.service";

@NgModule({
  declarations: [
    AppComponent,
    DataTableComponent,
    MainNavComponent
  ],
	imports: [
		BrowserModule,
		BrowserAnimationsModule,
		AppRoutingModule,
		HttpClientModule,

		FormsModule,
		ReactiveFormsModule,

		MatInputModule,
		MatFormFieldModule,
		MatToolbarModule,
		MatSidenavModule,
		MatIconModule,
		MatListModule,
		MatTableModule,
		MatPaginatorModule,
		MatSortModule,
		MatProgressBarModule,
    MatSnackBarModule,
	],
  providers: [
    CrossTabRelayService
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
