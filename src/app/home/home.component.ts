import { Component, OnInit } from "@angular/core";
import { HttpcallsService } from "../httpcalls.service";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"],
})
export class HomeComponent implements OnInit {
  view: any[] = [600, 300];

  // options
  public legend: boolean = true;
  public showLabels: boolean = true;
  public animations: boolean = true;
  public xAxis: boolean = true;
  public yAxis: boolean = true;
  public showYAxisLabel: boolean = false;
  public showXAxisLabel: boolean = false;
  public xAxisLabel: string = "Number of Days";
  public yAxisLabel: string = "Cases";
  public timeline: boolean = false;
  public gradient: boolean = true;
  public showGridLines: boolean = true;
  public roundDomains: boolean = true;
  public colorScheme = {
    domain: ["#1f8ef1", "#FF1493", "#00f2c3", "#ec250d"],
  };
  public top1 = 0;
  public top2 = 0;
  public top3 = 0;
  public globalresult;

  public multi1: any;
  public multi2: any;
  public multi3: any;

  constructor(private httpcall: HttpcallsService) {} //step 2

  ngOnInit(): void {
    this.httpcall.getbyCountries().subscribe((result: any) => {
      let countries = result.Countries;
      let first = 0;
      let second = 0;
      let third = 0;
      let index1 = -1;
      let index2 = -1;
      let index3 = -1;
      for (var i = 0; i < 186; i++) {
        if (countries[i].TotalConfirmed >= first) {
          third = second;
          index3 = index2;
          second = first;
          index2 = index1;
          first = countries[i].TotalConfirmed;
          index1 = i;
        } else if (countries[i].TotalConfirmed >= second) {
          third = second;
          index3 = index2;
          second = countries[i].TotalConfirmed;
          index2 = i;
        } else if (countries[i].TotalConfirmed >= third) {
          third = countries[i].TotalConfirmed;
          index3 = i;
        }
      }
      this.top1 = index1;
      this.top2 = index2;
      this.top3 = index3;
      this.globalresult = result;
      this.getChartData();
    }); //step3
  }
  getChartObjectData(result: any) {
    let totalCasesArray = [];
    for (let i of result) {
      const temp = {
        name: new Date(i.Date),
        value: i.Confirmed,
      };
      totalCasesArray.push(temp);
    }
    let totalCasesObject = {
      name: "Confirmed",
      series: totalCasesArray,
    };
    let totalDeathsArray = [];
    for (let i of result) {
      let temp = {
        name: new Date(i.Date),
        value: i.Deaths,
      };
      totalDeathsArray.push(temp);
    }
    let totalDeathsObject = {
      name: "Death",
      series: totalDeathsArray,
    };
    let totalRecoveredArray = [];
    for (let i of  result) {
      let temp = {
        name: new Date(i.Date),
        value: i.Recovered,
      };
      totalRecoveredArray.push(temp);
    }
    let totalRecoveredObject = {
      name: "Recovery",
      series: totalRecoveredArray,
    };
    let chartInfo = [];
    chartInfo.push(totalCasesObject);
    chartInfo.push(totalDeathsObject);
    chartInfo.push(totalRecoveredObject);
    return chartInfo;
  }

  getChartData() {
    this.httpcall
      .getChartDataByCountries(this.globalresult.Countries[this.top1].Slug)
      .subscribe((result: any) => {
        this.multi1 = this.getChartObjectData(result);
      });
    this.httpcall
      .getChartDataByCountries(this.globalresult.Countries[this.top2].Slug)
      .subscribe((result: any) => {
        this.multi2 = this.getChartObjectData(result);
      });
    this.httpcall
      .getChartDataByCountries(this.globalresult.Countries[this.top3].Slug)
      .subscribe((result: any) => {
        this.multi3 = this.getChartObjectData(result);
      });
  }
  public yAxisTickFormattingFn = this.yAxisTickFormatting.bind(this);
  public xAxisTickFormattingFn = this.xAxisTickFormatting.bind(this);
  yAxisTickFormatting(value) {
    return "";
  }
  xAxisTickFormatting(value) {
    return "";
  }
}
