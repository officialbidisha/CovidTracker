import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, forkJoin, of } from 'rxjs';
import { catchError, map, shareReplay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class HttpcallsService {
  // api.covid19api.com is dead (connection fails); disease.sh is a live,
  // free, no-auth-required replacement. Responses are adapted below to the
  // shape the components already expect.
  //
  // Note: disease.sh serves the Johns Hopkins archive, which stopped
  // updating on 9 Mar 2023. Its `updated` field is just when the cache was
  // refreshed, so "data as of" is taken from the last historical data point.
  private base = 'https://disease.sh/v3/covid-19';

  public headerDict = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  public requestOptions = {
    headers: new HttpHeaders(this.headerDict),
  };

  private dataAsOf$: Observable<Date | null>;

  constructor(private https: HttpClient) {}

  /** Date of the most recent data point in the upstream dataset. */
  getDataAsOf(): Observable<Date | null> {
    if (!this.dataAsOf$) {
      this.dataAsOf$ = this.https
        .get(`${this.base}/historical/all?lastdays=1`, this.requestOptions)
        .pipe(
          map((r: any) => {
            const dates = Object.keys(r?.cases || {});
            return dates.length ? parseUsDate(dates[dates.length - 1]) : null;
          }),
          catchError(() => of(null)),
          shareReplay({ bufferSize: 1, refCount: false })
        );
    }
    return this.dataAsOf$;
  }

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
      asOf: this.getDataAsOf(),
    }).pipe(
      map(({ countries, global, asOf }: any) => ({
        Countries: countries.map((c: any) => ({
          Country: c.country,
          CountryCode: c.countryInfo?.iso3 || c.countryInfo?.iso2 || c.country,
          Flag: c.countryInfo?.flag || '',
          Slug: c.country,
          Date: asOf,
          TotalConfirmed: c.cases,
          TotalDeaths: c.deaths,
          TotalRecovered: c.recovered,
        })),
        Global: {
          Date: asOf,
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
            Date: parseUsDate(date),
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

/** Parses disease.sh's `M/D/YY` keys (e.g. "3/9/23") without relying on Date's locale parsing. */
function parseUsDate(key: string): Date | null {
  const [m, d, y] = key.split('/').map(Number);
  if (!m || !d || isNaN(y)) {
    return null;
  }
  return new Date(y < 100 ? 2000 + y : y, m - 1, d);
}
