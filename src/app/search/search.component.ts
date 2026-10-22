import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, UntypedFormBuilder } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { HttpcallsService } from '../httpcalls.service';

@Component({
    selector: 'app-search',
    templateUrl: './search.component.html',
    styleUrls: ['./search.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class SearchComponent implements OnInit {
  public countryForm = new UntypedFormGroup({
    country: new UntypedFormControl(''),
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
    private formBuilder: UntypedFormBuilder,
    private httpcallsService: HttpcallsService
  ) {}
  public options: string[] = [];
  filteredOptions: Observable<string[]>;

  public error = false;
  public notFound = false;

  ngOnInit() {
    this.httpcallsService.getCountries().subscribe({
      next: (res) => {
        const result: any = res;
        for (const i of result) {
          this.options.push(i.Country);
        }
        // Re-emit so the autocomplete shows the list once it has loaded.
        this.countryForm.controls.country.updateValueAndValidity();
      },
      error: () => {
        this.error = true;
      },
    });

    this.filteredOptions = this.countryForm.controls.country.valueChanges.pipe(
      startWith(''),
      map((value) => this._filter(value))
    );
  }

  private _filter(value: string): string[] {
    const filterValue = (value || '').toLowerCase();
    return this.options.filter((option) =>
      option.toLowerCase().includes(filterValue)
    );
  }

  onSubmit(formValues) {
    const query = (formValues || '').trim();
    this.flagSearch = true;
    this.error = false;
    this.notFound = false;
    this.globalResultSearch = undefined;
    this.multi = undefined;
    if (query === '') {
      this.nullstring = true;
      return;
    }
    this.nullstring = false;
    this.httpcallsService.getbyCountries().subscribe({
      next: (response) => {
        this.countryData = response;
        const q = query.toLowerCase();
        const countries: any[] = this.countryData.Countries;
        // Prefer an exact name match, otherwise the first partial match.
        const match =
          countries.find((c) => c.Country.toLowerCase() === q) ||
          countries.find((c) => c.Country.toLowerCase().includes(q));
        if (!match) {
          this.notFound = true;
          return;
        }
        this.globalResultSearch = match;
        this.getChartData();
      },
      error: () => {
        this.error = true;
      },
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
      .subscribe({
        next: (result: any) => {
          this.multi = this.getChartObjectData(result);
        },
        error: () => {
          this.multi = [];
        },
      });
  }

  yAxisTickFormatting(value) {
    return '';
  }
  xAxisTickFormatting(value) {
    return '';
  }
}
