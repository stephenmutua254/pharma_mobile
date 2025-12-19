import { Component, OnInit } from '@angular/core';
import { SharedModules } from 'src/app/shared/shared.module';
import { ApexTooltip, ApexYAxis, NgApexchartsModule } from 'ng-apexcharts';
import {
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexDataLabels,
  ApexTitleSubtitle,
  ApexStroke,
  ChartComponent,
  ApexPlotOptions
} from 'ng-apexcharts';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
  standalone: true,
  imports: [SharedModules, NgApexchartsModule]
})
export class DashboardPage implements OnInit {
  
  loaded = false;
  chartDetails: ApexChart = {
    type: 'bar',
    height: 300,
    toolbar: {
      show: false // Hide the toolbar with the hamburger buttons
    }
  };

  chartSeries: ApexAxisChartSeries = [
    {
      name: 'Sales',
      data: []
    },{
      name: 'Purchases',
      data: []
    },
    {
      name: 'Profit',
      data: []
    }
  ];

  chartTitle: ApexTitleSubtitle = {
    text: 'Sales overview',
    align: 'left'
  };

  chartXAxis: ApexXAxis = {
    categories: []
  };

  chartYAxis: ApexYAxis = {
    show: false
  };

  chartDataLabels: ApexDataLabels = {
    enabled: false
  };

  options: ApexPlotOptions = {
    bar: {
      horizontal: false,
      columnWidth: "55%",
      distributed: false,
    }
  };

  tooltip: ApexTooltip = {
    y: {
      formatter: function(value: any, options: { series: any, seriesIndex: any, dataPointIndex: any, w: any }) {
        return new Intl.NumberFormat('en-us', {minimumFractionDigits: 2}).format(parseFloat(value.toString()));
      }
    }
  }


  constructor() { }

  ngOnInit() {
  }

}
