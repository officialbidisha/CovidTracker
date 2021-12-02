import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class HttpcallsService {

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
    return this.https.get('https://api.covid19api.com/countries', this.requestOptions);
  }
  getbyCountries(): Observable<any> {
    return this.https.get('https://api.covid19api.com/summary', this.requestOptions);
  }
  getChartDataByCountries(slug: any): Observable<any> {
    return this.https.get('https://api.covid19api.com/total/country/' + slug, this.requestOptions);
  }
  getCountrySpecific(country): Observable<any> {
    return this.https.get(
      'https://api.covid19api.com/country/' + country + '/status/confirmed', this.requestOptions
    );
  }
}
