import { Component, OnInit } from '@angular/core';
import { HttpcallsService } from '../httpcalls.service';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  
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
  top1=0;top2=0;top3=0;globalresult;

  constructor(private httpcall: HttpcallsService) { }//step 2

  ngOnInit(): void {
    this.httpcall.getbyCountries().subscribe((result:any)=> {console.log(result);
    let countries=result.Countries;let first=0;let second=0; let third=0; let index1=-1;let index2=-1;let index3=-1;
    for(var i=0;i<186;i++)
    {
        if(countries[i].TotalConfirmed>=first)
              {third=second;index3=index2;second=first;index2=index1;first=countries[i].TotalConfirmed;index1=i;}
        else if(countries[i].TotalConfirmed>=second){
            third=second;index3=index2;
            second=countries[i].TotalConfirmed; index2=i;
        }
        else if(countries[i].TotalConfirmed>=third){
              third=countries[i].TotalConfirmed;
              index3=i;
        }
    }
    this.top1=index1;this.top2=index2;this.top3=index3;this.globalresult=result;
    //console.log(countries[index1].TotalConfirmed); console.log(countries[index2].TotalConfirmed); console.log(countries[index3].TotalConfirmed);
    this.getChartData();
    });//step3
    
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
  multi1:any;
  multi2:any;
  multi3:any;
  getChartData(){
       this.httpcall.getChartDataByCountries(this.globalresult.Countries[this.top1].Slug).subscribe((result:any)=>{
              this.multi1=this.getChartObjectData(result);
       })
       this.httpcall.getChartDataByCountries(this.globalresult.Countries[this.top2].Slug).subscribe((result:any)=>{
              this.multi2= this.getChartObjectData(result);
      })
      this.httpcall.getChartDataByCountries(this.globalresult.Countries[this.top3].Slug).subscribe((result:any)=>{
        this.multi3=this.getChartObjectData(result);
        console.log(this.multi3);
      })
  }
  public yAxisTickFormattingFn = this.yAxisTickFormatting.bind(this); public xAxisTickFormattingFn = this.xAxisTickFormatting.bind(this); yAxisTickFormatting(value) { return "";}
   xAxisTickFormatting(value){ return "" ;}  

}
