import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class HttpcallsService {

  constructor(private https: HttpClient) { }
  getbyCountries(){
    return this.https.get("https://api.covid19api.com/summary");
  }
  getChartDataByCountries(slug:any){
    return this.https.get("https://api.covid19api.com/total/country/"+slug);
  }
}

