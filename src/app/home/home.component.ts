import { Component, OnInit } from '@angular/core';
import { HttpcallsService } from '../httpcalls.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  public view: any[] = [600, 300];

  /**
   * Options
   */
  public legend = true;
  public showLabels = true;
  public animations = true;
  public xAxis = true;
  public yAxis = true;
  public showYAxisLabel = false;
  public showXAxisLabel = false;
  public xAxisLabel = 'Number of Days';
  public yAxisLabel = 'Cases';
  public timeline = false;
  public gradient = true;
  public showGridLines = true;
  public roundDomains = true;
  public colorScheme = {
    domain: ['#1f8ef1', '#FF1493', '#00f2c3', '#ec250d'],
  };
  public top1 = 0;
  public top2 = 0;
  public top3 = 0;
  public globalresult;

  public multi1: any;
  public multi2: any;
  public multi3: any;

  public yAxisTickFormattingFn = this.yAxisTickFormatting.bind(this);
  public xAxisTickFormattingFn = this.xAxisTickFormatting.bind(this);

  constructor(private httpcall: HttpcallsService) {}

  ngOnInit(): void {
    this.httpcall.getbyCountries().subscribe((result: any) => {
      const countries = result.Countries;
      let first = 0;
      let second = 0;
      let third = 0;
      let index1 = -1;
      let index2 = -1;
      let index3 = -1;
      for (let i = 0; i < countries.length; i++) {
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
    });
  }

  public getChartObjectData(result: any) {
    const totalCasesArray = [];
    for (const i of result) {
      const temp = {
        name: new Date(i.Date),
        value: i.Confirmed,
      };
      totalCasesArray.push(temp);
    }
    const totalCasesObject = {
      name: 'Confirmed',
      series: totalCasesArray,
    };
    const totalDeathsArray = [];
    for (const i of result) {
      const temp = {
        name: new Date(i.Date),
        value: i.Deaths,
      };
      totalDeathsArray.push(temp);
    }
    const totalDeathsObject = {
      name: 'Death',
      series: totalDeathsArray,
    };
    const totalRecoveredArray = [];
    for (const i of  result) {
      const temp = {
        name: new Date(i.Date),
        value: i.Recovered,
      };
      totalRecoveredArray.push(temp);
    }
    const totalRecoveredObject = {
      name: 'Recovery',
      series: totalRecoveredArray,
    };
    const chartInfo = [];
    chartInfo.push(totalCasesObject);
    chartInfo.push(totalDeathsObject);
    chartInfo.push(totalRecoveredObject);
    return chartInfo;
  }

  public getChartData() {
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

  yAxisTickFormatting(value) {
    return '';
  }
  xAxisTickFormatting(value) {
    return '';
  }
}
