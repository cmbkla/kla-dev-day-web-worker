import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { Observable } from "rxjs";
import { User } from "../../models/user.model";

@Component({
  selector: 'app-data-table',
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.scss']
})
export class DataTableComponent implements AfterViewInit, OnChanges  {
  @Input() public data: Observable<User[]>;

  @Output() public filter: EventEmitter<string> = new EventEmitter<string>();
  @Output() public delete: EventEmitter<number> = new EventEmitter<number>();

  public displayedColumns: string[] = ["id", "firstName", "lastName", "email", "ipAddress", "action"];
  public dataSource = new MatTableDataSource<User>([]);
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    protected changeDetectorRef: ChangeDetectorRef,
  ){}

  public ngAfterViewInit(): void {
    if (!!this.dataSource) {
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    }
  }

  public ngOnChanges(changes: SimpleChanges) {
    if (Object.keys(changes).includes("data") && !!this.data) {
      this.data.subscribe(data => {
        if (this.dataSource.data !== data) {
          this.dataSource.data = data;
        } else {
          this.dataSource.data = [];
        }
        this.changeDetectorRef.detectChanges();
      });
    }
  }

  public deleteItem(row: User): void {
    this.delete.emit(row.id);
  }

  public doFilter($event: any): void {
    this.filter.emit($event.target.value);
  }

}
