import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class LoaderService {
  protected loadingSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public loadingObservable: Observable<boolean> = this.loadingSubject.asObservable();

  constructor() {
  }

  public loadingState(state: boolean): void {
    this.loadingSubject.next(state);
  }
}
