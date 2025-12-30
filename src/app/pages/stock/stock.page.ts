import { Location } from '@angular/common';
import { IonSearchbar, IonModal } from '@ionic/angular/standalone';
import { SharedModules } from 'src/app/shared/shared.module';
import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { debounceTime, fromEvent, map } from 'rxjs';
import { InfiniteScrollCustomEvent } from '@ionic/core';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth.service';
import { CryptoService } from 'src/app/services/crypto.service';
import { ToastService } from 'src/app/services/toast.service';
import { trigger, transition, style, animate } from '@angular/animations';
import { NewItemComponent } from './new-item/new-item.component';
import { BatchPurchasesComponent } from './batch-purchases/batch-purchases.component';
import { SellPriceEditComponent } from './sell-price-edit/sell-price-edit.component';
import { CategoriesComponent } from '../../shared/categories/categories.component';
import { FormulationsComponent } from '../../shared/formulations/formulations.component';
import { SharedComponentsModule } from 'src/app/shared/shared-components.module';

@Component({
  selector: 'app-stock',
  templateUrl: './stock.page.html',
  styleUrls: ['./stock.page.scss'],
  standalone: true,
  imports: [SharedModules,
            NewItemComponent,
            BatchPurchasesComponent,
            SellPriceEditComponent,
            NewItemComponent,
            SharedComponentsModule],
  animations: [trigger('enter', [
    transition('* => *', [
      style({ opacity: 0 }),
      animate('1s', style({ opacity: 1 }))
    ])
  ])]
})
export class StockPage implements OnInit {
  @ViewChild('searchbar', { static: true }) searchbar: IonSearchbar = {} as IonSearchbar;
  @ViewChild('newItemModal') newItemModal: IonModal = {} as IonModal;
  @ViewChild('batchesModal') batchesModal: IonModal = {} as IonModal;
  @ViewChild('priceEditModal') priceEditModal: IonModal = {} as IonModal;
  @ViewChild('categoriesModal') categoriesModal: IonModal = {} as IonModal;
  @ViewChild('formulationsModal') formulationsModal: IonModal = {} as IonModal;
   
  loaded = false;

  allStock: any[] = [];
  filteredStock: any[] = [];
  categories: any[] = [];
  vat_records: any[] = [];
  locations: any[] = [];
  minItemsTotal = 0;
  nearExpiryItemsTotal = 0;
  formulations: any[] = [];
  stockMarkups: any[] = [];
  sellUnitType = '';
  price_changed_items_total = 0;
  idle_stock_total = 0;
  filteredIdleStock: any[] = [];

  near_expiry = 0;
  idle_stock = 0;

  loaderToShow = '';


  openItemActions = false;
  editType = '';
  selectedItem: any = {};
  showAlert = false;

  openStockActions = false;

  itemActions = [
    {
      text: 'Edit drug details',
      icon: 'pencil-outline',
      handler: async () => {
        this.openItemActions = false;
        this.editType = 'edit';
        await this.newItemModal.present();
      },
      data: {
        action: 'edit'
      }
    },
    {
      text: 'Edit batches',
      icon: 'list',
      handler: () => {
        this.loaderToShow = this.selectedItem.id;
        this.openItemActions = false;
        this.showBatches('edit');
      },
      data: {
        action: 'batches'
      }
    },
    {
      text: 'Edit selling price',
      icon: 'cash-outline',
      handler: () => {
        this.loaderToShow = this.selectedItem.id;
        this.openItemActions = false;
        this.showBatches('price');
      },
      data: {
        action: 'batches'
      }
    },
    {
      text: 'Delete',
      icon: 'trash-outline',
      handler: () => {
        this.openItemActions = false;
        this.showAlert = true;
      },
      data: {
        action: 'delete'
      }
    }
  ];

  stockActions = [
    {
      text: 'Add new drug',
      icon: 'add',
      handler: async () => {
        this.openStockActions = false;
        this.editType = 'new';
        await this.newItemModal.present();
      },
      data: {
        action: 'edit'
      }
    },
    {
      text: 'Drug formulations',
      icon: 'list',
      handler: async () => {
        this.openStockActions = false;
        await this.formulationsModal.present();
      },
      data: {
        action: 'edit'
      }
    },
    {
      text: 'Drug categories',
      icon: 'list',
      handler: async () => {
        this.openStockActions = false;
        await this.categoriesModal.present();
      },
      data: {
        action: 'edit'
      }
    }
  ];

  constructor(private apiSrv: ApiService,
              private authSrv: AuthService,
              private toast: ToastService,
              private cdr: ChangeDetectorRef,
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

  ionViewDidLeave() {
    this.loaded = false;
    this.allStock = [];
    this.filteredStock = [];
  }

  ionViewDidEnter() {

    const request = {
      action: this.cryptoSrv.encryptText('get-all-stock-new'),
      added_by: this.authSrv.getUserToken('uid')
    }

    this.apiSrv.read(request).then(async (res) => {
      if(await this.apiSrv.checkResponseStatus(res)) {
        
        this.allStock = res.data.stock;
        this.categories = res.data.categories;
        this.vat_records = res.data.vat_records;
        this.locations = res.data.locations;
        this.minItemsTotal = res.data.min_items;
        this.nearExpiryItemsTotal = res.data.near_expiry;
        this.formulations = res.data.formulations;
        this.stockMarkups = res.data.markups;

        this.sellUnitType = res.sell_unit_type;
        this.price_changed_items_total = res.price_change;
        this.idle_stock_total = res.dead_stock;
        this.filteredIdleStock = res.dead_stock;


        const loc: any = {
          id: 0,
          name: 'All',
          color: '#ffff',
          date_created: new Date()
        }

        this.locations.push(loc);

        this.allStock.forEach(element => {
          element.attention = 0;
          element.sp_units_ok = true;

          if(parseInt(element.prices.toString()) < parseInt(element.batches.toString())) {
            element.attention = 1;
            element.sp_units_ok = false;
          }

          if(parseInt(element.expired.toString()) > 0) {
            element.attention = 1;
          }

          let category_id: any = element.category;
          // element.category = {} as Category;

          element.category = this.categories.find(x=> x.id === category_id);

        });

        this.formulations.forEach(element => {
          element.name = this.cryptoSrv.decryptText(element.name);
        });

        this.formulations = this.formulations.sort((a,b) => a.name.localeCompare(b.name));
        this.categories = this.categories.sort((a,b) => a.name.localeCompare(b.name));

        this.allStock = this.allStock.sort((a, b) => b.attention - a.attention);

        this.generateProducts();
      }

    }).catch(error => {
      this.toast.showErrorToast(error);
    });

  }

  filterList(searchQuery: string | undefined) {
    if (!searchQuery || searchQuery.trim() === '') {
      this.filteredStock = this.allStock.slice(0, 30); // Display an initial chunk instead of the entire list
    } else {
      const normalizedQuery = searchQuery.toLowerCase();
      this.filteredStock = this.allStock.filter(item =>
        item.name.toLowerCase().includes(normalizedQuery) ||
        item.api.includes(normalizedQuery) ||
        item.strength.includes(normalizedQuery) ||
        item.pack_size_1.includes(normalizedQuery)
        // item.description.includes(normalizedQuery)
      ).slice(0, 30); // Limit the number of items shown for large data sets
    }
  }

  onIonInfinite(event: any) {
    this.generateProducts();
    setTimeout(() => {
      (event as InfiniteScrollCustomEvent).target.complete();
    }, 500);
  }

  generateProducts() {
    let length = this.filteredStock.length;
    for (let i = length; i < length + 30; i++) {
      if(this.allStock[i]!=null) {
        this.filteredStock.push(this.allStock[i]);
      }
    }

    this.loaded = true;
  }

  showNearExpiry() {

  }

  selectItem(item: any) {
    this.selectedItem = JSON.parse(JSON.stringify(item));
    this.openItemActions = true;
  }

  async checkNewModalStatus($event: any) {
    await this.newItemModal.dismiss();
    if($event.status==true) {
      if(this.editType==='edit') {
        let item = this.filteredStock.find((x: any) => x.id == $event.item.id);
        if(item) {
          Object.assign(item, $event.item);
        }

        let item2 = this.allStock.find((x: any) => x.id == $event.item.id);
        if(item2) {
          Object.assign(item2, $event.item);
        }
      } else {
        this.filteredStock.unshift($event.item);
        this.allStock.unshift($event.item);
      }
    }
  }


  showBatches(type: string) {

    let item = JSON.parse(JSON.stringify(this.selectedItem));

    const request = {
      action: this.cryptoSrv.encryptText('get-item-batch-purchases'),
      item: item.id,
      added_by: this.authSrv.getUserToken('uid')
    };

    this.apiSrv.read(request).then(async res => {

      if(await this.apiSrv.checkResponseStatus(res)) {

        item.locations_qty = res.data;
        item.selling_units = res.units;
        item.alert_unit = res.alert_unit;
        item.alert_quantity = res.alert_quantity;

        item.locations_qty.forEach((loc: any) => {

          loc.prices_ok = true;

          let bp = loc.buying_price;

          if(loc.selling_prices.length < 1) {
            item.sp_units_ok = false;
            item.attention = 1;
          } else {
            loc.selling_prices.forEach((price: any) => {

              price.min_price_ok = true;
              price.recom_price_ok = true;

              let unit_bp = bp;

              if(price.unit.unit_quantity==1) {
                const maxUnit = item.selling_units.find((x: any) => x.unit_name==='Full pack');
                unit_bp = bp/maxUnit.unit_quantity;

                if(parseFloat(unit_bp.toString()) > parseFloat(price.min_selling_price.toString()) ||
                    parseFloat(unit_bp.toString()) > parseFloat(price.recom_selling_price.toString())) {
                      // console.log(unit_bp)
                      // console.log(price.min_selling_price)
                    loc.prices_ok = false;
                    return;
                }
              }
            });
          }

          loc.expiry_date = new Date(loc.expiry_date);

          loc.batch_no_locations.forEach((loc2: any) => {
            let full_pack=0;
            let piece=0;

            loc2.location_quantity = parseInt(loc2.location_quantity);

            if(this.sellUnitType==='Piece') {

              piece = loc2.location_quantity;

              loc2.full_pack = full_pack;
              loc2.piece = piece;

            } else {

              if(parseInt(loc.pack_size)==1) {
                if(this.selectedItem.sell_unit==='Fullpack') {
                  full_pack = loc2.location_quantity;
                } else {
                  piece = loc2.location_quantity;
                }
              } else {
                full_pack = Math.floor(loc2.location_quantity/parseInt(loc.pack_size));
                piece = loc2.location_quantity - (full_pack * parseInt(loc.pack_size));
              }

              loc2.full_pack = full_pack;
              loc2.piece = piece;

            }

          });

        });


        Object.assign(this.selectedItem, item);

        if(type=='edit') {
          await this.batchesModal.present();
        } else {
          await this.priceEditModal.present();
        }
        
        this.loaderToShow = '';
      }

    }).catch(error => {
      this.toast.showErrorToast(error);
    });

  }


  async batchesStatus($event: any) {
    await this.batchesModal.dismiss();
    this.ionViewDidEnter();
  }

  async priceStatus($event: any) {
    
    await this.priceEditModal.dismiss();
    if($event.status==true) {
      if($event.status==true) {
      
        let item = this.filteredStock.find((x: any) => x.id == $event.item.id);
        if(item) {
          Object.assign(item, $event.item);
        }

        let item2 = this.allStock.find((x: any) => x.id == $event.item.id);
        if(item2) {
          Object.assign(item2, $event.item);
        }
      }
    }
    
  }

  async formulationStatus($event: any) {
    await this.formulationsModal.dismiss();
    if($event.status==true) {
      this.selectedItem.formulation = $event.selectedItem;
    }
  }

  async categoryStatus($event: any) {
    await this.categoriesModal.dismiss();
    if($event.status==true) {
      this.selectedItem.category = $event.selectedItem;
    }
  }

}
