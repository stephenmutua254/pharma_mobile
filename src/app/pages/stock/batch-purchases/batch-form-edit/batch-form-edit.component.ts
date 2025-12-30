import { IonDatetime } from '@ionic/angular/standalone';
import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { SharedModules } from 'src/app/shared/shared.module';
import { format } from 'date-fns';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth.service';
import { CryptoService } from 'src/app/services/crypto.service';
import { ToastService } from 'src/app/services/toast.service';
import { SharedComponentsModule } from 'src/app/shared/shared-components.module';
@Component({
  selector: 'app-batch-form-edit',
  templateUrl: './batch-form-edit.component.html',
  styleUrls: ['./batch-form-edit.component.scss'],
  imports: [SharedModules, SharedComponentsModule]
})
export class BatchFormEditComponent implements OnInit {
  @ViewChild('expiry_date', {static: false}) expiryDate: IonDatetime = {} as IonDatetime;
  
  @Output() status = new EventEmitter<{status: boolean, batch?: any, item?: any}>();
  @Input() selectedBatch: any = {};
  @Input() selectedItem: any = {};
  @Input() vat_records: any[] = [];
  @Input() type = '';
  @Input() selling_prices: any[] = [];
  
  showNotification = false;
  showLoader = false;

  price_1_error = false;

  constructor(private apiSrv: ApiService,
              private authSrv: AuthService,
              private toast: ToastService,
              private cryptoSrv: CryptoService) { }

  ngOnInit() {
    this.selectedBatch.buying_price = parseFloat(this.selectedBatch.buying_price).toFixed(1);
    this.expiryDate.value = format(this.selectedBatch.expiry_date, "yyyy-MM-dd'T'HH:mm:ss");
    
    this.selling_prices.forEach((element: any) => {
      element.recom_selling_price = parseInt(element.recom_selling_price)
      element.min_selling_price = parseInt(element.min_selling_price)
    });

    if(this.selectedItem.sell_unit=='Fullpack') {
      this.selling_prices = this.selling_prices.filter((x: any) => x.unit.unit_name === 'Full pack');
    }

    if(this.selectedItem.sell_unit=='Piece') {
      this.selling_prices = this.selling_prices.filter((x: any) => x.unit.unit_name === 'Piece')
    }
  }

  close() {
    this.status.emit({status: false});
  }


  checkPrice(item: any) {
    
    let piece_bp = this.selectedBatch.buying_price/parseInt(this.selectedBatch.pack_size);
    

    if(item.unit.unit_name=='Piece' && item.min_selling_price < piece_bp) {
      item.min_selling_price = piece_bp;
    }

    if(item.unit.unit_name=='Piece' && item.recom_selling_price < piece_bp) {
      item.recom_selling_price = piece_bp;
    }


    let full_bp = this.selectedBatch.buying_price;
    if(item.unit.unit_name=='Full pack' && item.min_selling_price < full_bp) {
      item.min_selling_price = full_bp;
    }

    if(item.unit.unit_name=='Full pack' && item.recom_selling_price < full_bp) {
      item.recom_selling_price = full_bp;
    }

    if(item.min_selling_price > item.recom_selling_price) {
      item.min_selling_price = item.recom_selling_price
    }
  }

  saveItemBatch() {

    this.showLoader = true;

    const expiry = typeof this.expiryDate.value === 'string' ? this.expiryDate.value : format(new Date(), "yyyy-MM-dd");
    const bp_per_piece = this.selectedBatch.buying_price/parseInt(this.selectedBatch.pack_size);
    
    const request = {
      action: this.cryptoSrv.encryptText('update_batch_details'),
      item_id: this.selectedItem.id,
      sl_id: this.selectedBatch.id,
      batch_no: this.cryptoSrv.encryptText(this.selectedBatch.batch_no),
      expiry: this.cryptoSrv.encryptText(expiry),
      buying_price: this.cryptoSrv.encryptText(bp_per_piece.toString()),
      vat_id: this.selectedBatch.vat.id,
      added_by: this.authSrv.getUserToken('uid')
    };

    this.apiSrv.post(request).then(async res => {

      if(await this.apiSrv.checkResponseStatus(res)) {
        this.showNotification = true;
        this.selectedBatch.expiry_date = new Date(expiry);
        setTimeout(() => {
          this.status.emit({status: true, batch: this.selectedBatch, item: this.selectedItem});
        }, 1500);
      }

    }).catch(error => {
      this.toast.showErrorToast(error);
    });

  }

  saveSellingPrice() {

    this.showLoader = true;

    const bp_per_piece = this.selectedBatch.buying_price/parseInt(this.selectedBatch.pack_size);
    let request: any = {};

    if(this.selling_prices.length>1) {

      const maxUnit = this.selling_prices.find(x => x.unit.unit_name === 'Full pack');
      const minUnit = this.selling_prices.find(x => x.unit.unit_name === 'Piece');

      request = {
        action: this.cryptoSrv.encryptText('update_item_selling_prices'),
        item_id: this.selectedItem.id,
        batch_no: this.cryptoSrv.encryptText(this.selectedBatch.batch_no),
        stock_location_id: this.selectedBatch.id,
        buying_price: this.cryptoSrv.encryptText(bp_per_piece.toString()),
        expiry_date: this.cryptoSrv.encryptText(format(this.selectedBatch.expiry_date, "yyyy-MM-dd")),
        vat: this.selectedBatch.vat.id,
        unit_1_id: minUnit.unit.id,
        unit_1_min_price: this.cryptoSrv.encryptText(minUnit.min_selling_price.toString()),
        unit_1_recom_price: this.cryptoSrv.encryptText(minUnit.recom_selling_price.toString()),
        unit_2_id: maxUnit.unit.id,
        unit_2_min_price: this.cryptoSrv.encryptText(maxUnit.min_selling_price.toString()),
        unit_2_recom_price: this.cryptoSrv.encryptText(maxUnit.recom_selling_price.toString()),
        selling_vat: this.cryptoSrv.encryptText(this.selectedBatch.selling_prices[0].vat_percent.toString()),
        sell_discount: this.cryptoSrv.encryptText(this.selectedBatch.selling_prices[0].sell_discount.toString()),
        batch_discount: this.cryptoSrv.encryptText(this.selectedBatch.selling_prices[0].batch_discount.toString()),
        bonus_sell_qty: this.cryptoSrv.encryptText(this.selectedBatch.selling_prices[0].bonus_sell_qty.toString()),
        bonus_qty: this.cryptoSrv.encryptText(this.selectedBatch.selling_prices[0].bonus_qty.toString()),
        added_by: this.authSrv.getUserToken('uid')
      }

    } else {

      const unit_to_update = this.selectedBatch.selling_prices.find((x: any) => x.unit.id === this.selling_prices[0].unit.id);

      let maxUnit: any = {};
      let minUnit: any = {};

      if(unit_to_update.unit.unit_name === 'Full pack') {
        maxUnit = this.selling_prices[0];
        minUnit = this.selectedBatch.selling_prices.find((x: any) => x.unit.unit_name === 'Piece');
      } else {
        minUnit = this.selling_prices[0];
        maxUnit = this.selectedBatch.selling_prices.find((x: any) => x.unit.unit_name === 'Full pack');
      }

      request = {
        action: this.cryptoSrv.encryptText('update_item_selling_prices'),
        item_id: this.selectedItem.id,
        batch_no: this.cryptoSrv.encryptText(this.selectedBatch.batch_no),
        stock_location_id: this.selectedBatch.id,
        buying_price: this.cryptoSrv.encryptText(bp_per_piece.toString()),
        expiry_date: this.cryptoSrv.encryptText(format(this.selectedBatch.expiry_date, "yyyy-MM-dd")),
        vat: this.selectedBatch.vat.id,
        unit_1_id: minUnit.unit.id,
        unit_1_min_price: this.cryptoSrv.encryptText(minUnit.min_selling_price.toString()),
        unit_1_recom_price: this.cryptoSrv.encryptText(minUnit.recom_selling_price.toString()),
        unit_2_id: maxUnit.unit.id,
        unit_2_min_price: this.cryptoSrv.encryptText(maxUnit.min_selling_price.toString()),
        unit_2_recom_price: this.cryptoSrv.encryptText(maxUnit.recom_selling_price.toString()),
        selling_vat: this.cryptoSrv.encryptText(this.selectedBatch.selling_prices[0].vat_percent.toString()),
        sell_discount: this.cryptoSrv.encryptText(this.selectedBatch.selling_prices[0].sell_discount.toString()),
        batch_discount: this.cryptoSrv.encryptText(this.selectedBatch.selling_prices[0].batch_discount.toString()),
        bonus_sell_qty: this.cryptoSrv.encryptText(this.selectedBatch.selling_prices[0].bonus_sell_qty.toString()),
        bonus_qty: this.cryptoSrv.encryptText(this.selectedBatch.selling_prices[0].bonus_qty.toString()),
        added_by: this.authSrv.getUserToken('uid')
      }

    }

    this.apiSrv.post(request).then(async res => {

      if(await this.apiSrv.checkResponseStatus(res)) {
        this.showNotification = true;
        setTimeout(() => {
          this.status.emit({status: true, batch: this.selectedBatch, item: this.selectedItem});
        }, 1500);
      }

    }).catch(error => {
      this.toast.showErrorToast(error);
    });

  }

}
