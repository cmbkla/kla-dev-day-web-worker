import { HttpClient } from "@angular/common/http";
import { Injectable, OnDestroy } from '@angular/core';
import { MatSnackBar } from "@angular/material/snack-bar";
import { BehaviorSubject, filter, Observable, Subscription } from "rxjs";
import { CrossTabRelayService } from "./cross-tab-relay.service";
import { LoaderService } from "./loader.service";
import { User } from "../models/user.model";

@Injectable({
  providedIn: 'root'
})
export class DataService implements OnDestroy {
  protected readonly dataRelayKey: string = "application-data-service-data";
  protected readonly processRelayKey: string = "application-data-service-process";
  protected subscriptions: Subscription = new Subscription();

  protected dataSubject: BehaviorSubject<any> = new BehaviorSubject<User[]>([]);
  public dataObservable: Observable<User[]> = this.dataSubject.asObservable();
  protected loadedData: User[] = [];
  protected lastFilter: string = "";

  protected processIsActive: boolean = false;
  protected worker: SharedWorker;

  constructor(
    public httpClient: HttpClient,
    public loaderService: LoaderService,
    protected snackBar: MatSnackBar,
    protected crossTabRelayService: CrossTabRelayService,
  ) {
    this.subscriptions.add(this.crossTabRelayService.relayStream.pipe(
      filter(x => x.type === this.dataRelayKey)
    ).subscribe(message => {
      if (!Array.isArray(message?.payload)) {
        this.setLoadedData([]);
        return;
      }

      this.setLoadedData(message.payload as User[]);
    }));

    this.subscriptions.add(this.crossTabRelayService.relayStream.pipe(
      filter(x => x.type === this.processRelayKey)
    ).subscribe(message => {
      this.processIsActive = message.payload;
    }));

    this.worker = new SharedWorker("assets/data-service-shared.worker.js");
    this.worker.port.onmessage = (e) => {
      switch (e.data) {
        case "already":
          this.showError("Application Error: The Process is already running.");
          break;
        case "done":
          this.crossTabRelayService.relay(this.processRelayKey, false);
          this.loaderService.loadingState(false);
          this.showSuccess("Process complete");
          break;
        case "bad":
          this.showError("Application Error: cannot run The Process, bad data.");
          break;
      }
    };
  }

  public ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  public load(size: "small" | "medium" | "large" | "excessive"): void {
    this.loaderService.loadingState(true);

    const finalizeLoad = (dataToSet: User[]) => {
      this.setLoadedData(dataToSet);
      this.crossTabRelayService.relay(this.dataRelayKey, dataToSet);
      this.loaderService.loadingState(false);
    };

    this.httpClient.get(`/assets/${size}-data.json`).subscribe({
      next: data => {
        if (!data) {
          this.showError("Application Error: failed to load data");
          finalizeLoad([]);
          return;
        }

        finalizeLoad(data as User[]);
        this.showSuccess("Loaded data");
      },
      error: () => {
        finalizeLoad([]);
        this.showSuccess("Application Error: failed to load data");
      }
    });
  }

  public filter(filter: string): void {
    this.lastFilter = filter;
    if (this.lastFilter?.length < 1) {
      this.dataSubject.next(Array.from(this.loadedData));
      return;
    }

    this.dataSubject.next(Array.from(this.loadedData.filter(row =>
      `${row.firstName}|${row.lastName}|${row.email}|${row.ipAddress}|${row.firstName} ${row.lastName}`
        .toLowerCase()
        .includes(filter.toLowerCase())
    )));
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
    this.crossTabRelayService.relay(this.dataRelayKey, this.loadedData);
    this.filter(this.lastFilter);
    this.showSuccess(`Deleted  #${itemId}`);
  }

  public process(): void {
    if (this.processIsActive) {
      this.showError("Cannot start The Process: it is active already active on another tab.");
      return;
    }
    this.crossTabRelayService.relay(this.processRelayKey, true);
    this.loaderService.loadingState(true);

    this.worker.port.postMessage(this.loadedData);
  }

  protected setLoadedData(data: User[]): void {
    this.loadedData = data;
    this.filter(this.lastFilter);
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
