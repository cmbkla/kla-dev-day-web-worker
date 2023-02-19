import { HttpClient } from "@angular/common/http";
import { Injectable } from '@angular/core';
import { MatSnackBar } from "@angular/material/snack-bar";
import { BehaviorSubject, Observable } from "rxjs";
import { LoaderService } from "./loader.service";
import { User } from "../models/user.model";

@Injectable({
  providedIn: 'root'
})
export class DataService {
  protected dataSubject: BehaviorSubject<any> = new BehaviorSubject<User[]>([]);
  public dataObservable: Observable<User[]> = this.dataSubject.asObservable();
  protected loadedData: User[] = [];
  protected lastFilter: string = "";

  constructor(
    public httpClient: HttpClient,
    public loaderService: LoaderService,
    protected snackBar: MatSnackBar
  ) {
  }

  public load(size: "small" | "medium" | "large" | "excessive"): void {
    this.loaderService.loadingState(true);

    this.httpClient.get(`/assets/${size}-data.json`).subscribe({
      next: data => {
        if (!data) {
          this.loadedData = [];
          this.dataSubject.next(this.loadedData);
          this.loaderService.loadingState(false);
          this.showError("Application Error: failed to load data");
          return;
        }
        this.loadedData = (<User[]>data).map(d => d as User);
        this.dataSubject.next(this.loadedData);
        this.loaderService.loadingState(false);
        this.showError("Loaded data");
      },
      error: () => {
        this.loadedData = [];
        this.dataSubject.next(this.loadedData);
        this.loaderService.loadingState(false);
        this.showSuccess("Application Error: failed to load data");
      }
    });
  }

  public filter(filter: string): void {
    this.lastFilter = filter;
    this.dataSubject.next(this.loadedData.filter(row =>
      `${row.firstName}|${row.lastName}|${row.email}|${row.ipAddress}|${row.firstName} ${row.lastName}`
        .toLowerCase()
        .includes(filter.toLowerCase())
    ));
  }

  public delete(itemId: number): void {
    const deleteIndex: number = this.loadedData.findIndex(x => x.id === itemId);

    if (deleteIndex < 0) {
      this.showError("Application Error: invalid item");
      return;
    }

    this.loadedData.splice(
      deleteIndex,
      1
    );
    this.filter(this.lastFilter);
    this.showSuccess(`Deleted  #${itemId}`);
  }

  public process(): void {
    this.loaderService.loadingState(true);

    this.loadedData.forEach(r => {
      for (let step = 0; step < 1000; step++) {
        console.log(`${r.id}-${step}`);
      }
    });

    this.loaderService.loadingState(false);
    this.showSuccess("Process complete");
  }

  protected showSuccess(message: string): void {
    this.snackBar.open(message, undefined, {
      panelClass: ['success-snackbar'],
      duration: 2000,
      horizontalPosition: "right",
      verticalPosition: "top",
    });
  }

  protected showError(message: string): void {
    this.snackBar.open(message, "Ok", {
      panelClass: ['error-snackbar'],
      duration: 2000,
      horizontalPosition: "right",
      verticalPosition: "top",
    });
  }
}
