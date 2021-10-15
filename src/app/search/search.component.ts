import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { HttpcallsService } from '../httpcalls.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent implements OnInit {
  public countryForm = new FormGroup({
    country: new FormControl(''),
  });
  public view: any[] = [600, 300];

  /**
   * Options for ngx-charts
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
  public countryData: any;
  public globalResultSearch;
  public flagSearch: boolean;
  public nullstring: boolean;
  public multi: any;
  public yAxisTickFormattingFn = this.yAxisTickFormatting.bind(this);
  public xAxisTickFormattingFn = this.xAxisTickFormatting.bind(this);
  constructor(
    private formBuilder: FormBuilder,
    private httpcallsService: HttpcallsService
  ) {}
  public options: string[] = [];
  filteredOptions: Observable<string[]>;

  ngOnInit() {
    this.httpcallsService.getCountries().subscribe((res) => {
      const result: any = res;
      for (const i of result) {
        this.options.push(i.Country);
      }
    });

    this.filteredOptions = this.countryForm.controls.country.valueChanges.pipe(
      startWith(''),
      map((value) => this._filter(value))
    );
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.options.filter((option) =>
      option.toLowerCase().includes(filterValue)
    );
  }
  onSubmit(formValues) {
    this.flagSearch = true;
    this.httpcallsService.getbyCountries().subscribe((response) => {
      {
        this.countryData = response;
        if (formValues === '') {
          this.nullstring = true;
        } else {
          for (let i = 0; i < 186; i++) {
            if (this.countryData.Countries[i].Country.includes(formValues)) {
              this.globalResultSearch = this.countryData.Countries[i];
            }
          }
        }
      }
      this.getChartData();
    });
  }
  getChartObjectData(result: any) {
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
    for (const i of result) {
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

  getChartData() {
    this.httpcallsService
      .getChartDataByCountries(this.globalResultSearch?.Slug)
      .subscribe((result: any) => {
        this.multi = this.getChartObjectData(result);
      });
  }

  yAxisTickFormatting(value) {
    return '';
  }
  xAxisTickFormatting(value) {
    return '';
  }
}
