import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { HttpcallsService } from '../httpcalls.service';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
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

  public error = false;

  ngOnInit(): void {
    this.load();
  }

  /** One card per top-3 country; the chart series arrives separately. */
  get cards() {
    if (!this.globalresult) {
      return [];
    }
    const countries = this.globalresult.Countries;
    return [
      { rank: '1st', country: countries[this.top1], series: this.multi1 },
      { rank: '2nd', country: countries[this.top2], series: this.multi2 },
      { rank: '3rd', country: countries[this.top3], series: this.multi3 },
    ];
  }

  public load(): void {
    this.error = false;
    this.httpcall.getbyCountries().subscribe({
      next: (result: any) => {
        // Rank by total confirmed cases (descending) and keep the top three.
        const ranked = result.Countries
          .map((c: any, i: number) => ({ i, n: c.TotalConfirmed }))
          .sort((a: any, b: any) => b.n - a.n);
        this.top1 = ranked[0].i;
        this.top2 = ranked[1].i;
        this.top3 = ranked[2].i;
        this.globalresult = result;
        this.getChartData();
      },
      error: () => {
        this.error = true;
      },
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
    const load = (idx: number, assign: (series: any) => void) =>
      this.httpcall
        .getChartDataByCountries(this.globalresult.Countries[idx].Slug)
        .subscribe({
          next: (result: any) => assign(this.getChartObjectData(result)),
          error: () => assign([]),
        });
    load(this.top1, (series) => (this.multi1 = series));
    load(this.top2, (series) => (this.multi2 = series));
    load(this.top3, (series) => (this.multi3 = series));
  }

  yAxisTickFormatting(value) {
    return '';
  }
  xAxisTickFormatting(value) {
    return '';
  }
}
