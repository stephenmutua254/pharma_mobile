import { Component, OnInit, ViewChild } from '@angular/core';
import { SharedModules } from 'src/app/shared/shared.module';
import { ApexTooltip,
        ApexYAxis,
        NgApexchartsModule } from 'ng-apexcharts';
import {
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexDataLabels,
  ApexTitleSubtitle,
  ApexStroke,
  ApexLegend,
  ApexGrid,
  ChartComponent,
  ApexPlotOptions
} from 'ng-apexcharts';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth.service';
import { CryptoService } from 'src/app/services/crypto.service';
import { ToastService } from 'src/app/services/toast.service';
import { DatePipe } from '@angular/common';
import { MenuController } from '@ionic/angular';
import ApexCharts from 'apexcharts';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
  standalone: true,
  imports: [SharedModules, NgApexchartsModule],
  providers: [DatePipe]
})
export class DashboardPage implements OnInit {
  @ViewChild("chart", { static: false }) chart!: ChartComponent;
  @ViewChild("chart2", { static: false }) chart2!: ChartComponent;
  
  loaded = false;

  chartDetails: ApexChart = {
    type: 'bar',
    height: 300,
    toolbar: {
      show: false, // Hide the toolbar with the hamburger buttons
      autoSelected: 'pan',
      tools: {
        download: false,
        selection: false, // Disable selection to force pan
        zoom: false,      // Disable zoom tool to force pan
        zoomin: false,
        zoomout: false,
        pan: true,        // Explicitly enable the pan tool
        reset: false
      }
    },
    zoom: {
      enabled: true,
      type: 'x',
    },
  };

  grid: ApexGrid = {
    show: true, // Keep the grid container
    yaxis: {
      lines: {
        show: false // THIS disables the horizontal lines
      }
    },
    xaxis: {
      lines: {
        show: false // This ensures vertical lines are also off (optional)
      }
    }
  }


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

  chartSeries2: ApexAxisChartSeries = [
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
    type: 'category',
    tickPlacement: 'on',
    categories: [],
    min: 0, // Start index
    max: 4,      // End index,
    range: 4,
    // tickAmount: 4,
  };

  chartXAxis2: ApexXAxis = {
    type: 'category',
    tickPlacement: 'on',
    categories: [],
    min: 0, // Start index
    max: 5,      // End index,
    range: 5,
    // tickAmount: 4,
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
    },
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
              private menuCtrl: MenuController,
              private cryptoSrv: CryptoService,) { }

  ngOnInit() {
    const style = getComputedStyle(document.body);

    // Pull the hex/rgb values from your Ionic CSS variables
    const primary = style.getPropertyValue('--ion-color-primary').trim();
    const success = style.getPropertyValue('--ion-color-secondary').trim();

    this.chartSeries[0].color = primary;
    this.chartSeries[1].color = success;

    this.chartSeries2[0].color = primary;
    this.chartSeries2[1].color = success;
  }

  ionViewWillEnter() {
    this.loaded = false;
    this.menuCtrl.enable(false);
  }

  ionViewDidEnter() {
    // this.loadCtrl.showLoad('Authenticating...');

    this.chartSeries[0].data = [];
    this.chartSeries[1].data = [];

    this.chartSeries2[0].data = [];
    this.chartSeries2[1].data = [];

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
        

        this.chartSeries2[0].data = resp.monthly_sales.map((e: any) => e.gross_sales);
        this.chartSeries2[1].data = resp.monthly_sales.map((e: any) => e.gross_profit);
        this.chartXAxis2.categories = resp.monthly_sales.map((e: any) => this.datePipe.transform(e.date_sold, 'LLL yy'));
        
        
        this.loaded = true;

        setTimeout(() => {
          if(this.chart && this.chart2) {
            // this.chartXAxis.categories = categories;
            this.chart.zoomX(0, 0);
            this.chart2.zoomX(0, 0);
          }
        }, 200);

        
      }

    }).catch(error => {
      this.toast.showErrorToast(error);
    });
  }

}
