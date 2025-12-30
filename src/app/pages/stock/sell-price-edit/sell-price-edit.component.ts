import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { format } from 'crypto-js';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth.service';
import { CryptoService } from 'src/app/services/crypto.service';
import { ToastService } from 'src/app/services/toast.service';
import { SharedModules } from 'src/app/shared/shared.module';

@Component({
  selector: 'app-sell-price-edit',
  templateUrl: './sell-price-edit.component.html',
  styleUrls: ['./sell-price-edit.component.scss'],
  imports: [SharedModules]
})
export class SellPriceEditComponent implements OnInit {
  @Input() selectedItem: any = {};
  @Output() status = new EventEmitter<{status: boolean, item?: any}>();
  
  selling_prices: any[] = [];
  buying_price_per_piece = 0;
  
  showLoader = false;
  showNotification = false;

  constructor(private apiSrv: ApiService,
              private authSrv: AuthService,
              private toast: ToastService,
              private cryptoSrv: CryptoService) { }

  ngOnInit() {
    // get sell price for latest batch
    this.selling_prices = this.selectedItem.locations_qty[0].selling_prices;

    if(this.selectedItem.sell_unit=='Fullpack') {
      this.selling_prices = this.selectedItem.locations_qty[0].selling_prices.filter((x: any) => x.unit.unit_name === 'Full pack');
    }

    if(this.selectedItem.sell_unit=='Piece') {
      this.selling_prices = this.selectedItem.locations_qty[0].selling_prices.filter((x: any) => x.unit.unit_name === 'Piece');
    }
    
    this.buying_price_per_piece = parseFloat(this.selectedItem.locations_qty[0].buying_price.toString())/parseInt(this.selectedItem.locations_qty[0].pack_size);

  }

  close() {
    this.status.emit({status: false})
  }

  checkPrice(item: any) {
    
    if(item.unit.unit_name=='Piece' && item.min_selling_price < this.buying_price_per_piece) {
      item.min_selling_price = this.buying_price_per_piece;
    }

    if(item.unit.unit_name=='Piece' && item.recom_selling_price < this.buying_price_per_piece) {
      item.recom_selling_price = this.buying_price_per_piece;
    }


    let full_bp = this.buying_price_per_piece*parseInt(this.selectedItem.pack_size)
    if(item.unit.unit_name=='Full pack' && item.min_selling_price < full_bp) {
      item.min_selling_price = full_bp;
    }

    if(item.unit.unit_name=='Full pack' && item.recom_selling_price < full_bp) {
      item.recom_selling_price = full_bp;
    }

    if(item.min_selling_price > item.recom_selling_price) {
      item.min_selling_price = item.recom_selling_price;
    }
  }


  saveSellingPrice() {
  
      this.showLoader = true;
  
      let request: any = {};
  
      if(this.selling_prices.length>1) {
  
        const maxUnit = this.selling_prices.find(x => x.unit.unit_name === 'Full pack');
        const minUnit = this.selling_prices.find(x => x.unit.unit_name === 'Piece');
  
        request = {
          action: this.cryptoSrv.encryptText('update_item_batches_prices'),
          item_id: this.selectedItem.id,
          min_price: this.cryptoSrv.encryptText(maxUnit.min_selling_price.toString()),
          recom_price: this.cryptoSrv.encryptText(maxUnit.recom_selling_price.toString()),
          recom_price2: this.cryptoSrv.encryptText(minUnit.recom_selling_price.toString()),
          min_price2: this.cryptoSrv.encryptText(minUnit.min_selling_price.toString()),
          added_by: this.authSrv.getUserToken('uid')
        };

      } else {
  
        const unit_to_update = this.selectedItem.locations_qty[0].selling_prices.find((x: any) => x.unit.id === this.selling_prices[0].unit.id);
  
        let maxUnit: any = {};
        let minUnit: any = {};
  
        if(unit_to_update.unit.unit_name === 'Full pack') {
          maxUnit = this.selling_prices[0];
          minUnit = this.selectedItem.locations_qty[0].selling_prices.find((x: any) => x.unit.unit_name === 'Piece');
        } else {
          minUnit = this.selling_prices[0];
          maxUnit = this.selectedItem.locations_qty[0].selling_prices.find((x: any) => x.unit.unit_name === 'Full pack');
        }
  
        request = {
          action: this.cryptoSrv.encryptText('update_item_batches_prices'),
          item_id: this.selectedItem.id,
          min_price: this.cryptoSrv.encryptText(maxUnit.min_selling_price.toString()),
          recom_price: this.cryptoSrv.encryptText(maxUnit.recom_selling_price.toString()),
          recom_price2: this.cryptoSrv.encryptText(minUnit.recom_selling_price.toString()),
          min_price2: this.cryptoSrv.encryptText(minUnit.min_selling_price.toString()),
          added_by: this.authSrv.getUserToken('uid')
        };
  
      }
  
      this.apiSrv.post(request).then(async res => {
  
        if(await this.apiSrv.checkResponseStatus(res)) {
          this.showNotification = true;
          setTimeout(() => {
            if(this.selling_prices.length>1) {
              Object.assign(this.selectedItem.locations_qty[0].selling_prices, this.selling_prices);
            } else {
               const unit_to_update = this.selectedItem.locations_qty[0].selling_prices.find((x: any) => x.unit.id === this.selling_prices[0].unit.id);
               Object.assign(unit_to_update, this.selling_prices[0]);
            }
            this.status.emit({status: true, item: this.selectedItem});
          }, 1500);
        }
  
      }).catch(error => {
        this.toast.showErrorToast(error);
      });
  
    }

}
