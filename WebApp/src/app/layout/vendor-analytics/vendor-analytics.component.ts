import { Component, OnInit } from '@angular/core';
import { Chart } from 'angular-highcharts';
import { routerTransition } from 'src/app/shared/router-animations';
import { AppServiceService } from 'src/app/app-service.service';
import { IUserRequest } from 'src/app/interface/IResponse';
import { UserServiceService } from 'src/app/shared/user-service.service';

@Component({
  selector: 'app-vendor-analytics',
  templateUrl: './vendor-analytics.component.html',
  styleUrls: ['./vendor-analytics.component.scss'],
  animations: [routerTransition()]

})
export class VendorAnalyticsComponent implements OnInit {

  constructor(private appservice: AppServiceService, private userService: UserServiceService) {
    let body= [];
    let type = "vendor";
    body.push(this.userService.getUser().id);
    body.push(type);
    
    this.appservice.get<IUserRequest[]>('US-VEN',body).subscribe((x)=>{
      this.requests = x.filter(y => y.listOfServices?.length > 0);
      this.requests.forEach(y => {
        y.listOfServices.forEach(z =>{
          if(this.pieChartData.has(z.desc)){
            this.pieChartData.set(z.desc, this.pieChartData.get(z.desc) + Number.parseInt(z.estimatedCost))
          }else{
            this.pieChartData.set(z.desc,Number.parseInt(z.estimatedCost));
          }
        })
      })
      for (let [key, value] of this.pieChartData) {
        let body = {
          name : key,
          y : value
        }
          this.pieChartDataDisp.push(body);  
      }
      this.getPieChart(this.pieChartDataDisp)
      let months = [ "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec" ];
      months.forEach(x=>{
        this.lineChartData.set(x, 0);
      })
      this.requests.forEach(y=>{
           let date =  y.created_Date.split("-");
           let month_index =  parseInt(date[1],10) - 1;
           if(this.lineChartData.has(months[month_index])){
            this.lineChartData.set(months[month_index], Number.parseFloat(this.lineChartData.get(months[month_index])) + Number.parseFloat(y.totalCost.toString()))
           }
      })
      for (let [key, value] of this.lineChartData) {
          this.lineChartDataDisp.push(Math.floor(value));  
      }
      this.getLineChart(this.lineChartDataDisp)
    })
   }
   pieChart : any;
   lineChart : any;
   title : string = "Analytics";
   requests : IUserRequest[];
   pieChartData = new Map();
   lineChartData = new Map();
   lineChartDataDisp = [];
   pieChartDataDisp = [];

   //get pie chart data
   getPieChart(dataDisp:any){
    this.pieChart = new Chart({
      chart: {
        type: 'pie',
        plotBackgroundColor: null,
        plotBorderWidth: null,
        plotShadow: false,
      },
      title: {
        text: 'Service Analytics'
      },
      credits: {
        enabled: false
      },
      plotOptions: {
        pie: {
            allowPointSelect: true,
            cursor: 'pointer',
            dataLabels: {
                enabled: true,
                format: '<b>{point.name}</b>: {point.percentage:.1f} %'
            }
        }
      },     
      series: [{
        type: 'pie',
        name: 'Service',
        data: dataDisp
    }]
    });
   }

   //line chart data
   getLineChart(datadisp : any){
    this.lineChart = new Chart({
      chart: {
        type: 'line'
      },
      title: {
        text: 'Income Analytics'
      },
      xAxis: {
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
      },
      credits: {
        enabled: false
      },
      series: [{
        type: 'line',
        name: 'Income',
        data: datadisp
    }]
    });
  }
  

  ngOnInit(): void {
  }

}
