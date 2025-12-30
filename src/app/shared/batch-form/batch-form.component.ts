import { ToastService } from './../../services/toast.service';
import { ApiService } from './../../services/api.service';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SharedModules } from '../shared.module';
import { CryptoService } from 'src/app/services/crypto.service';
import { AuthService } from 'src/app/services/auth.service';
import { SharedComponentsModule } from '../shared-components.module';

@Component({
  selector: 'app-batch-form',
  templateUrl: './batch-form.component.html',
  styleUrls: ['./batch-form.component.scss'],
  imports: [SharedModules, SharedComponentsModule]
})
export class BatchFormComponent implements OnInit {
  @Input() selectedBatch: any = {};
  @Input() selectedItem: any = {};
  @Input() cartId = '';
  @Output() status = new EventEmitter<boolean>();
  @Output() item = new EventEmitter<{qty: number, price: number, unit: string}>();
  // @Output() newPrice = '';

  quantity: any = '';
  price = 0;
  recom_price = 0;
  buying_price = 0;
  unit = '';
  quantityError = '';
  priceError = '';

  fullpack = 0;
  piece = 0;


  showLoader = false;

  notification = '';
  showNotification = false;

  constructor(private apiSrv: ApiService,
              private authSrv: AuthService,
              private toast: ToastService,
              private cryptoSrv: CryptoService) { }

  ngOnInit() {
    this.unit = '';
    this.price = parseFloat(this.selectedBatch.sell_price);
    this.selectedBatch.buying_price = parseFloat(this.selectedBatch.buying_price);

    if(parseInt(this.selectedItem.pack_size.toString()) == 1) {
      if(this.selectedItem.sell_unit==='Fullpack') {
        this.unit = 'Fullpack';
      } else {
        this.unit = 'Piece';
      }
    } else {
      if(this.selectedBatch.full_pack > 0) {
        this.fullpack = this.selectedBatch.full_pack;
      } else {
        if(this.selectedBatch.piece > 0) {
          let full_unit = this.selectedBatch.item_prices.find((x: any) => x.unit.unit_name==='Piece');
          // this.selectedItem.sell_price = full_unit.recom_selling_price;
          // this.selectedItem.recom_price = full_unit.recom_selling_price;
          this.selectedItem.min_price = full_unit.min_selling_price;
          // this.selectedItem.price = full_unit.recom_selling_price;

          this.buying_price = parseFloat((parseFloat(this.selectedItem.buying_price)/parseInt(this.selectedItem.pack_size)).toFixed(1));

          this.piece = this.selectedBatch.piece;
          this.price = full_unit.recom_selling_price;
        }
      }
    }
  }

  close() {
    this.status.emit(false);
  }

  unitSelected(unit: string) {
    if(unit==='Piece') {
      this.buying_price = parseFloat(this.selectedItem.buying_price) / this.selectedItem.pack_size;
      let full_unit = this.selectedBatch.item_prices.find((x: any) => x.unit.unit_name==='Piece');
      this.price = full_unit.recom_selling_price;
      this.recom_price = full_unit.recom_selling_price;
      this.selectedItem.min_price = full_unit.min_selling_price;
    } else {
      this.buying_price = parseFloat(this.selectedItem.buying_price);
      let full_unit = this.selectedBatch.item_prices.find((x: any) => x.unit.unit_name==='Full pack');
      this.price = full_unit.recom_selling_price;
      this.recom_price = full_unit.recom_selling_price;
      this.selectedItem.min_price = full_unit.min_selling_price;
    }

    this.confirmQuantity();
    this.confirmSellPrice();
  }

  confirmQuantity() {
    
    let full = Math.floor(this.selectedBatch.qty/this.selectedItem.pack_size);
    
    if(!isNaN(this.quantity) && this.quantity!=null) {
      if(this.unit==='Fullpack') {
        if(parseInt(this.quantity.toString()) > full) {
          this.quantityError = 'Only ' + full + ' fullpacks are available!';
        } else if(parseInt(this.quantity.toString()) < 1) {
          this.quantityError = 'Quantity should be greator than 1';
        } else {
          this.quantityError = '';
        }

      } else {
        if(parseInt(this.quantity.toString()) > this.selectedBatch.qty) {
          this.quantityError = 'Only ' + this.selectedBatch.qty + ' pieces are available!';
        } else if(parseInt(this.quantity.toString()) < 1) {
          this.quantityError = 'Quantity should be greator than 1';
        } else {
          this.quantityError = '';
        }
      }
    } else {
      this.quantityError = 'Provide a number';
    }
  }

  confirmSellPrice() {
    if(this.price!=null) {

      if(!isNaN(this.price)) {
        if(parseFloat(this.price.toString()) < parseFloat(this.selectedItem.min_price)) {
          this.priceError = 'Minimum price is ' + this.selectedItem.min_price;
        } else {
          this.priceError = '';
        }
      } else {
        this.priceError = 'Provide a number';
      }
      this.selectedItem.discount = 0;

    } else {
      this.priceError = 'Provide a number';
    }
  }

  saveItemBatch() {

    this.showLoader = true;

    let total_pieces = 0;
    let unit_bp = 0;
    if(this.unit==='Fullpack') {
      this.unit='Full pack';
      total_pieces += this.quantity * parseInt(this.selectedItem.pack_size);
      unit_bp = parseFloat(this.buying_price.toString()) * parseInt(this.selectedItem.pack_size);
    } else {
      total_pieces = this.quantity;
      unit_bp = this.selectedBatch.buying_price;
    }

    const request = {
      action: this.cryptoSrv.encryptText("add-item-to-cart-new"),
      cart_id: this.cartId,
      item_id: this.selectedItem.id,
      location_id: this.selectedItem.location_id,
      s_location_id: this.selectedBatch.s_l_id,
      batch_no: this.cryptoSrv.encryptText(this.selectedBatch.batch_no),
      unit_selected: this.cryptoSrv.encryptText(this.unit),
      // unit_id: this.itemToSellModel.unit.id,
      unit_quantity: this.cryptoSrv.encryptText(this.quantity.toString()),
      tt_qty: this.cryptoSrv.encryptText(total_pieces.toString()),
      unit_bp: this.cryptoSrv.encryptText(unit_bp.toString()),
      unit_bp_vat: this.cryptoSrv.encryptText(this.selectedBatch.buying_vat.toString()),
      unit_price: this.cryptoSrv.encryptText(this.price.toString()),
      min_sp: this.cryptoSrv.encryptText(this.selectedItem.min_price.toString()),
      recom_sp: this.cryptoSrv.encryptText(this.recom_price.toString()),
      uid: this.authSrv.getUserToken("uid"),
    };

    this.apiSrv.post(request).then(async (resp) => {
      this.showLoader = false;
      if(await this.apiSrv.checkResponseStatus(resp)) {
        this.notification = 'Item added to cart';
        this.showNotification = true;
        setTimeout(() => {
          this.status.emit(true);
          this.item.emit({
            qty: this.quantity,
            price: this.price,
            unit: this.unit
          }) 
        }, 1500);
      }
    }).catch(error => {
      this.showLoader = false;
      this.toast.showErrorToast(error);
    });

  }


}