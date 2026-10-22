import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';

import { HttpcallsService } from './httpcalls.service';

const BASE = 'https://disease.sh/v3/covid-19';

describe('HttpcallsService', () => {
  let service: HttpcallsService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(HttpcallsService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('derives "data as of" from the last historical point, not the cache timestamp', () => {
    let asOf: Date | null | undefined;
    service.getDataAsOf().subscribe((d) => (asOf = d));
    http
      .expectOne(`${BASE}/historical/all?lastdays=1`)
      .flush({ cases: { '3/9/23': 1 } });
    expect(asOf).toEqual(new Date(2023, 2, 9));
  });

  it('resolves "data as of" to null when the request fails', () => {
    let asOf: Date | null | undefined;
    service.getDataAsOf().subscribe((d) => (asOf = d));
    http
      .expectOne(`${BASE}/historical/all?lastdays=1`)
      .flush('boom', { status: 500, statusText: 'Server Error' });
    expect(asOf).toBeNull();
  });

  it('adapts countries with flag, code and as-of date', () => {
    let result: any;
    service.getbyCountries().subscribe((r) => (result = r));
    http.expectOne(`${BASE}/countries`).flush([
      {
        country: 'India',
        cases: 10,
        deaths: 2,
        recovered: 7,
        countryInfo: { iso3: 'IND', flag: 'https://x/in.png' },
      },
    ]);
    http.expectOne(`${BASE}/all`).flush({ cases: 10, deaths: 2, recovered: 7 });
    http
      .expectOne(`${BASE}/historical/all?lastdays=1`)
      .flush({ cases: { '3/9/23': 1 } });

    expect(result.Countries[0]).toEqual({
      Country: 'India',
      CountryCode: 'IND',
      Flag: 'https://x/in.png',
      Slug: 'India',
      Date: new Date(2023, 2, 9),
      TotalConfirmed: 10,
      TotalDeaths: 2,
      TotalRecovered: 7,
    });
  });

  it('maps historical timelines to dated points', () => {
    let points: any[] = [];
    service.getChartDataByCountries('India').subscribe((p) => (points = p));
    http.expectOne(`${BASE}/historical/India?lastdays=30`).flush({
      timeline: {
        cases: { '3/8/23': 5, '3/9/23': 6 },
        deaths: { '3/8/23': 1, '3/9/23': 2 },
        recovered: { '3/8/23': 0, '3/9/23': 0 },
      },
    });
    expect(points.length).toBe(2);
    expect(points[1]).toEqual({
      Date: new Date(2023, 2, 9),
      Confirmed: 6,
      Deaths: 2,
      Recovered: 0,
    });
  });
});
