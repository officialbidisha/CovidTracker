import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class HttpcallsService {
  constructor(private https: HttpClient) {}

  getCountries(): Observable<any> {
    return this.https.get('https://api.covid19api.com/countries');
  }
  getbyCountries(): Observable<any> {
    return this.https.get('https://api.covid19api.com/summary');
  }
  getChartDataByCountries(slug: any): Observable<any> {
    return this.https.get('https://api.covid19api.com/total/country/' + slug);
  }
  getCountrySpecific(country): Observable<any> {
    return this.https.get(
      'https://api.covid19api.com/country/' + country + '/status/confirmed'
    );
  }
}
