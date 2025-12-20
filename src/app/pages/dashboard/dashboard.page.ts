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
  ApexLegend,
  ChartComponent,
  ApexPlotOptions
} from 'ng-apexcharts';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth.service';
import { CryptoService } from 'src/app/services/crypto.service';
import { ToastService } from 'src/app/services/toast.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
  standalone: true,
  imports: [SharedModules, NgApexchartsModule],
  providers: [DatePipe]
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

  legend: ApexLegend = {
    show: false
  }

  chartSeries: ApexAxisChartSeries = [
    {
      name: 'Sales',
      data: [],
      color: ''
    },{
      name: 'Gross profit',
      data: []
    }
  ];

  chartTitle: ApexTitleSubtitle = {
    text: 'Weekly sales',
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
      borderRadius: 7,
      borderRadiusApplication: "end",
      borderRadiusWhenStacked: 'last'
    }
  };

  stroke: ApexStroke = {
    show: false,
    width: 0
  }

  tooltip: ApexTooltip = {
    y: {
      formatter: function(value: any, options: { series: any, seriesIndex: any, dataPointIndex: any, w: any }) {
        return new Intl.NumberFormat('en-us', {minimumFractionDigits: 2}).format(parseFloat(value.toString()));
      }
    }
  }

  

  price_change = 0;
  near_expiry = 0;
  dead_stock = 0;
  low_stock = 0;


  constructor(private apiSrv: ApiService,
              private authSrv: AuthService,
              private toast: ToastService,
              private datePipe: DatePipe,
              private cryptoSrv: CryptoService,) { }

  ngOnInit() {
    const style = getComputedStyle(document.body);

    // Pull the hex/rgb values from your Ionic CSS variables
    const primary = style.getPropertyValue('--ion-color-primary').trim();
    const success = style.getPropertyValue('--ion-color-secondary').trim();

    this.chartSeries[0].color = primary;
    this.chartSeries[1].color = success;
  }

  ionViewWillEnter() {
    this.loaded = false;
  }

  ionViewDidEnter() {
    // this.loadCtrl.showLoad('Authenticating...');

    this.chartSeries[0].data = [];
    this.chartSeries[1].data = [];

    const request = {
      action: this.cryptoSrv.encryptText('get-dashboard-report-mobile'),
      added_by: this.authSrv.getUserToken('uid')
    }

    this.apiSrv.read(request).then(async (resp) => {
      if(await this.apiSrv.checkResponseStatus(resp)) {
        
        this.price_change = resp.price_change;
        this.near_expiry = resp.near_expiry;
        this.dead_stock = resp.dead_stock;
        this.low_stock = resp.min_items;

        this.chartSeries[0].data = resp.weekly_sales.map((e: any) => e.gross_sales);
        this.chartSeries[1].data = resp.weekly_sales.map((e: any) => e.gross_profit);
        this.chartXAxis.categories = resp.weekly_sales.map((e: any) => this.datePipe.transform(e.date_sold, 'MMM dd'));
        
        // resp.weekly_sales.forEach((element: any) => {
        //   this.chartSeries[0].data.push(element.gross_sales);
        //   this.chartSeries[1].data.push(element.gross_profit);
        //   this.chartXAxis.categories.push(this.datePipe.transform(element.date_sold, 'MMM dd'))
        // });

        this.loaded = true;
        
      }

    }).catch(error => {
      this.toast.showErrorToast(error);
    });
  }

}
