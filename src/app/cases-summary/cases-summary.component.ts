import {
  AfterViewInit,
  Component,
  OnInit,
  ViewChild,
} from "@angular/core";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { HttpcallsService } from "../httpcalls.service";
import { MatSort } from "@angular/material/sort";

@Component({
  selector: "app-cases-summary",
  templateUrl: "./cases-summary.component.html",
  styleUrls: ["./cases-summary.component.scss"],
})
export class CasesSummaryComponent implements OnInit, AfterViewInit {
  public loaded = false;
  public country: string[] = [];
  public totalConfirmed: number[] = [];
  public totalDeaths: number[] = [];
  public totalRecovered: number[] = [];
  public displayedColumns: string[] = [
    "position",
    "country",
    "confirmed",
    "recovered",
    "deaths",
  ];
  public dtSource = [];
  public dataSource = new MatTableDataSource<PeriodicElement>(this.dtSource);

  @ViewChild(MatPaginator, { static: false })
  set paginator(value: MatPaginator) {
    this.dataSource.paginator = value;
  }

  @ViewChild(MatSort, { static: false })
  set matSort(value: MatSort) {
    this.dataSource.sort = value;
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.matSort;
  }

  constructor(private httpcall: HttpcallsService) {}

  ngOnInit(): void {
    this.httpcall.getbyCountries().subscribe((result: any) => {
      for (let eachRes of result.Countries) {
        this.country.push(eachRes.Country);
        this.totalConfirmed.push(eachRes.TotalConfirmed);
        this.totalRecovered.push(eachRes.TotalRecovered);
        this.totalDeaths.push(eachRes.TotalDeaths);
      }
      for (let i = 0; i < this.country.length; i++) {
        const obj = {
          position: i + 1,
          country: this.country[i],
          confirmed: this.totalConfirmed[i],
          recovered: this.totalConfirmed[i] - this.totalDeaths[i],
          deaths: this.totalDeaths[i],
        };
        this.dtSource.push(obj);
      }
      if (this.dtSource.length === this.country.length) {
        this.dataSource = new MatTableDataSource<any>(this.dtSource);
        this.dataSource.paginator = this.paginator;
        this.loaded = true;
      }
    });
  }
}

export interface PeriodicElement {
  country: string;
  position: number;
  confirmed: number;
  recovered: number;
  deaths: number;
}
