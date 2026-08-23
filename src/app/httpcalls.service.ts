import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class HttpcallsService {
  // api.covid19api.com is dead (connection fails); disease.sh is a live,
  // free, no-auth-required replacement. Responses are adapted below to the
  // shape the components already expect, so no component code changes.
  private base = 'https://disease.sh/v3/covid-19';

  public headerDict = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  public requestOptions = {
    headers: new HttpHeaders(this.headerDict),
  };
  constructor(private https: HttpClient) {}

  getCountries(): Observable<any> {
    return this.https.get(`${this.base}/countries`, this.requestOptions).pipe(
      map((countries: any[]) =>
        countries.map((c) => ({ Country: c.country, Slug: c.country }))
      )
    );
  }

  getbyCountries(): Observable<any> {
    return forkJoin({
      countries: this.https.get(`${this.base}/countries`, this.requestOptions),
      global: this.https.get(`${this.base}/all`, this.requestOptions),
    }).pipe(
      map(({ countries, global }: any) => ({
        Countries: countries.map((c: any) => ({
          Country: c.country,
          Slug: c.country,
          TotalConfirmed: c.cases,
          TotalDeaths: c.deaths,
          TotalRecovered: c.recovered,
        })),
        Global: {
          TotalConfirmed: global.cases,
          TotalDeaths: global.deaths,
          TotalRecovered: global.recovered,
        },
      }))
    );
  }

  getChartDataByCountries(slug: any): Observable<any> {
    return this.https
      .get(`${this.base}/historical/${encodeURIComponent(slug)}?lastdays=30`, this.requestOptions)
      .pipe(
        map((result: any) => {
          const timeline = result?.timeline || { cases: {}, deaths: {}, recovered: {} };
          return Object.keys(timeline.cases || {}).map((date) => ({
            Date: date,
            Confirmed: timeline.cases[date],
            Deaths: timeline.deaths[date],
            Recovered: timeline.recovered[date] || 0,
          }));
        })
      );
  }

  getCountrySpecific(country): Observable<any> {
    return this.https.get(
      `${this.base}/historical/${encodeURIComponent(country)}?lastdays=30`,
      this.requestOptions
    );
  }
}
