import { Component, OnInit } from '@angular/core';
import { FormControl,FormGroup, FormBuilder } from '@angular/forms';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import { HttpcallsService } from '../httpcalls.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {
  countryForm = new FormGroup({
    country: new FormControl(''),
    
  });
  view: any[] = [600, 300];

  // options
  legend: boolean = true;
  showLabels: boolean = true;
  animations: boolean = true;
  xAxis: boolean = true;
  yAxis: boolean = true;
  showYAxisLabel: boolean =false;
  showXAxisLabel: boolean = false;
  xAxisLabel: string = 'Number of Days';
  yAxisLabel: string = 'Cases';
  timeline: boolean = false;
  gradient: boolean=true;
  showGridLines:boolean=true;
  roundDomains:boolean=true;
  colorScheme = {
    domain: ['#1f8ef1','#FF1493','#00f2c3','#ec250d']
  };
  public countryData:any;
  public globalResultSearch;
  public flagSearch;
  constructor(private formBuilder: FormBuilder,private httpcallsService: HttpcallsService) { }
  options: string[] = [

      "Uganda",
      "Greenland",
      "Honduras",
      "Philippines",
      "Ukraine",
      "Jersey",
      "Morocco",
      "South Georgia and the South Sandwich Islands",
      "Germany",
      "Ireland",
      "Solomon Islands",
      "Uzbekistan",
      "Cameroon",
      "Denmark",
      "Papua New Guinea",
      "Suriname",
      "Togo",
      "Western Sahara",
       "British Virgin Islands",
      "Comoros",
      "Russian Federation",
      "Mauritius",
      "Trinidad and Tobago",
      "Christmas Island",
      "Malawi",
      "Australia",
      "Cocos (Keeling) Islands",
      "Peru",
      "South Africa",
      "Algeria",
      "Bulgaria",
      "Ghana",
      "Norway",
      "Côte d'Ivoire",
      "Lebanon",
      "Saint Helena",
      "Faroe Islands",
      "Guatemala",
      "Guinea",
      "Pakistan",
      "Bolivia",
       "Chad",
      "Tokelau",
      "Barbados",
      "Libya",
      "Sudan",
      "Wallis and Futuna Islands",
      "Botswana",
      "Falkland Islands (Malvinas)",
      "Nepal",
      "Kyrgyzstan",
      "Mexico",
      "Norfolk Island",
      "Northern Mariana Islands",
      "Antarctica",
      "Belarus",
      "Bermuda",
      "Timor-Leste",
      "Mali",
      "Switzerland",
      "Egypt",
      "Hungary",
      "Luxembourg",
      "Niue",
      "Poland",
      "Slovakia",
      "Gabon",
      "Tajikistan",
      "Lithuania",
      "Madagascar",
      "Taiwan, Republic of China",
      "Aruba",
      "Greece",
      "Namibia",
      "Niger",
      "United States of America",
      "Chile",
      "Ethiopia","Monaco","Costa Rica","Macao, SAR China","Panama","Zimbabwe","Pitcairn","South Sudan","Martinique","Guernsey","Spain","Sweden","Swaziland","Finland","Liechtenstein","Montserrat","Isle of Man","Maldives","Puerto Rico","United Kingdom","Bahrain","Canada","Eritrea","Guam","Iceland","ALA Aland Islands","Congo (Kinshasa)","Nauru","Bosnia and Herzegovina",
      "Estonia","Kazakhstan","Saint Lucia","Argentina","Benin","Ecuador","Saint Vincent and Grenadines","Mozambique","Vanuatu","Austria","Cyprus","Guinea-Bissau","Liberia","Azerbaijan","Jamaica","Singapore","Yemen","Holy See (Vatican City State)","Saint-Martin (French part)","Bahamas","Cambodia","Croatia","Dominican Republic","Burundi","Kenya","Montenegro","New Caledonia","Syrian Arab Republic (Syria)","Brazil","Gambia","Micronesia, Federated States of","Saint-Barthélemy","Tunisia","Turkey","Afghanistan","Andorra","Bangladesh","Kuwait","French Southern Territories","Lao PDR","Palau","Albania","Belgium","Djibouti","Hong Kong, SAR China","Oman","Bouvet Island","China","Czech Republic","British Indian Ocean Territory","Réunion","Saint Pierre and Miquelon","US Minor Outlying Islands","American Samoa","Equatorial Guinea","Gibraltar","Iraq","Belize","New Zealand","Uruguay","Guadeloupe","Guyana","Marshall Islands","Sierra Leone","Bhutan","El Salvador","French Guiana","Portugal","Congo (Brazzaville)","Nigeria","San Marino","Virgin Islands, US","Antigua and Barbuda","Burkina Faso","Cayman Islands",
      "Central African Republic",
      "Nicaragua",
      "Romania",
      "Dominica",
      "Moldova",
      "Iran, Islamic Republic of",
      "Tanzania, United Republic of",
      "France","Italy","Kiribati","Samoa","Cook Islands","Grenada","Palestinian Territory","Seychelles","Anguilla","Japan","Lesotho","Mauritania","Angola","Brunei Darussalam","Colombia",
      "Indonesia",
      "Malaysia",
      "Somalia",
      "Myanmar",
     "Saint Kitts and Nevis",
      "Haiti",
      "India",
      "Zambia",
      "Fiji",
      "Latvia",
      "Viet Nam",
      "Rwanda",
      "Senegal",
      "Thailand",
      "Mongolia",
      "Tuvalu",
      "United Arab Emirates",
      "Armenia",
      "Israel",
      "Mayotte",
      "Serbia",
      "Slovenia",
      "Tonga",
      "Turks and Caicos Islands",
      "Korea (South)",
      "Paraguay",
      "Sao Tome and Principe",
      "Macedonia, Republic of",
      "Netherlands Antilles",
      "Sri Lanka",
      "Cape Verde",
      "Georgia",
      "Heard and Mcdonald Islands",
      "French Polynesia",
      "Netherlands",
      "Qatar",
      "Republic of Kosovo"



  ];
  filteredOptions: Observable<string[]>;

  ngOnInit() {
    this.filteredOptions = this.countryForm.controls.country.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value))
    );
    
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.options.filter(option => option.toLowerCase().includes(filterValue));
  };
  onSubmit(formValues){
    console.log(formValues);
    this.flagSearch=true;
    this.httpcallsService.getbyCountries().subscribe
      (response=>{
          {
            this.countryData=response;
            console.log(this.countryData);
            for(var i=0;i<186;i++){
            
               if(this.countryData.Countries[i].Country.includes(formValues)){
                  this.globalResultSearch=this.countryData.Countries[i];
               }
            }
            console.log(this.globalResultSearch);
          }
          this.getChartData();
      });
  }
  getChartObjectData(result:any){
    console.log(result);
    let totalCasesArray=[]; 
    
    for(let i=0;i<result.length;i++){
      let temp={
        name:new Date(result[i].Date),
        value:result[i].Confirmed
      }
      totalCasesArray.push(temp);
    }
    console.log(totalCasesArray);
    let totalCasesObject={
      name:"Confirmed",
      series:totalCasesArray
    }
    let totalDeathsArray=[];
    for(let i=0;i<result.length;i++){
      let temp={
        name:new Date(result[i].Date),
        value:result[i].Deaths
      }
      totalDeathsArray.push(temp);
    }
    let totalDeathsObject={
      name:"Death",
      series:totalDeathsArray
    }
    let totalRecoveredArray=[];
    for(let i=0;i<result.length;i++){
      let temp={
        name:new Date(result[i].Date),
        value:result[i].Recovered
      }
      totalRecoveredArray.push(temp);
    }
    let totalRecoveredObject={
      name:"Recovery",
      series:totalRecoveredArray
    }
    console.log(totalCasesObject);console.log(totalDeathsObject);console.log(totalRecoveredObject);
    let chartInfo=[];
    chartInfo.push(totalCasesObject);
    chartInfo.push(totalDeathsObject);
    chartInfo.push(totalRecoveredObject);
    return chartInfo;
  }
  multi:any;
  getChartData(){
    this.httpcallsService.getChartDataByCountries(this.globalResultSearch.Slug).subscribe((result:any)=>{
           this.multi=this.getChartObjectData(result);
    })
    
}
public yAxisTickFormattingFn = this.yAxisTickFormatting.bind(this); public xAxisTickFormattingFn = this.xAxisTickFormatting.bind(this); yAxisTickFormatting(value) { return "";}
   xAxisTickFormatting(value){ return "" ;} 
}
