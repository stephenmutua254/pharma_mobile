import { Component, OnInit, ViewChild } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { SharedModules } from 'src/app/shared/shared.module';
import { IonSearchbar } from '@ionic/angular/standalone';
import { debounceTime, fromEvent, map } from 'rxjs';
import { DatePipe } from '@angular/common';
import { AuthService } from 'src/app/services/auth.service';
import { CryptoService } from 'src/app/services/crypto.service';
import { ToastService } from 'src/app/services/toast.service';
import { InfiniteScrollCustomEvent } from '@ionic/angular/standalone';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-sell',
  templateUrl: './sell.page.html',
  styleUrls: ['./sell.page.scss'],
  standalone: true,
  imports: [SharedModules],
  animations: [trigger('enter', [
    transition('* => *', [
      style({ opacity: 0 }),
      animate('1s', style({ opacity: 1 }))
    ])
  ])]
})
export class SellPage implements OnInit {
  @ViewChild('searchbar', { static: true }) searchbar: IonSearchbar = {} as IonSearchbar;
  
  allStock: any[] = [];
  stock: any[] = [];
  stockBatches: any[] = [];
  filteredStock: any[] = [];

  cartItems = [];
  waitingCustomers = [];
  nearExpiryItemsTotal = [];
  idle_stock_total = [];

  sellUnitType = '';

  loaded = false;

  constructor(private apiSrv: ApiService,
              private authSrv: AuthService,
              private toast: ToastService,
              private cryptoSrv: CryptoService,) { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.searchbar.getInputElement().then(inputEl => {
      fromEvent(inputEl, 'input')
        .pipe(
          debounceTime(100), // adjust the debounce time (300ms)
          map((event: any) => event.target.value)
        )
        .subscribe((searchText: string) => {
          this.filterList(searchText);
        });
    });
  }

  filterList(searchQuery: string | undefined) {
    if (!searchQuery || searchQuery.trim() === '') {
      this.filteredStock = this.stockBatches.slice(0, 30); // Display an initial chunk instead of the entire list
    } else {
      const normalizedQuery = searchQuery.toLowerCase();
      this.filteredStock = this.stockBatches.filter(item =>
        item.name.toLowerCase().includes(normalizedQuery) ||
        item.api.includes(normalizedQuery) ||
        item.strength.includes(normalizedQuery) ||
        item.pack_size_1.includes(normalizedQuery)
        // item.description.includes(normalizedQuery)
      ).slice(0, 30); // Limit the number of items shown for large data sets
    }
  }

  ionViewWillEnter() {
    this.loaded = false;
    this.filteredStock = [];
    this.stockBatches = [];
  }

  ionViewDidEnter() {

    const request = {
      action: this.cryptoSrv.encryptText('get-stock-and-cart-items-new'),
      uid: this.authSrv.getUserToken('uid')
    }

    this.apiSrv.read(request).then(async (resp) => {
      if(await this.apiSrv.checkResponseStatus(resp)) {
        
        this.cartItems = resp.cartItems;
        this.waitingCustomers = resp.waiting;
        this.nearExpiryItemsTotal = resp.near_expiry;
        this.sellUnitType = resp.sell_unit_type;
        this.allStock = resp.stock;

        resp.allCartItems.forEach((element: any) => {
          // check item in stock
          let item = this.allStock.find(x => x.id ==  element.item.id);

          if(item) {
            let quantity = parseInt(item.total_quantity) - (parseInt(element.qty.toString()) * element.unit.unit_quantity);

            if(quantity<0) {
              item.total_quantity = '0';
            } else {
              item.total_quantity = quantity.toString();
            }
          }
        });

        this.allStock.forEach(element => {

          let full_pack=0;
          let piece=0;

          if(this.sellUnitType==='Piece') {

            piece = parseInt(element.total_quantity);

            element.full_pack = full_pack;
            element.piece = piece;

          } else {

            if(parseInt(element.pack_size)==1) {
              if(element.sell_unit==='Fullpack') {
                full_pack = parseInt(element.total_quantity);
              } else {
                piece = parseInt(element.total_quantity);
              }
            } else {
              full_pack = Math.floor(parseInt(element.total_quantity)/parseInt(element.pack_size));
              piece = parseInt(element.total_quantity) - (full_pack * parseInt(element.pack_size));
            }

            element.full_pack = full_pack;
            element.piece = piece;

          }

          this.stockBatches.push(element);

        });

        // this.filteredStock = [...this.stockBatches];
        this.generateProducts();

        

      }

    }).catch(error => {
      this.toast.showErrorToast(error);
    });

  }

  generateProducts() {
    let length = this.filteredStock.length;
    for (let i = length; i < length + 30; i++) {
      if(this.stockBatches[i]!=null) {
        this.filteredStock.push(this.stockBatches[i]);
      }
    }

    this.loaded = true;
  }

  onIonInfinite(event: any) {
    this.generateProducts();
    setTimeout(() => {
      (event as InfiniteScrollCustomEvent).target.complete();
    }, 500);
  }

  selectItem(item: any) {

  }

}
