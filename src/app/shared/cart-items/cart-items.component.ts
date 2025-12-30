import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { SharedModules } from '../shared.module';
import { IonItemSliding, IonModal } from '@ionic/angular/standalone';
import { CryptoService } from 'src/app/services/crypto.service';
import { AuthService } from 'src/app/services/auth.service';
import { ApiService } from 'src/app/services/api.service';
import { ToastService } from 'src/app/services/toast.service';
import { BatchFormComponent } from '../batch-form/batch-form.component';
import { PaymentComponent } from '../payment/payment.component';

@Component({
  selector: 'app-cart-items',
  templateUrl: './cart-items.component.html',
  styleUrls: ['./cart-items.component.scss'],
  imports: [SharedModules, BatchFormComponent, PaymentComponent]
})
export class CartItemsComponent implements OnInit {
  @ViewChild('batchModal') batchModal: IonModal = {} as IonModal;
  @ViewChild('paymentModal') paymentModal: IonModal = {} as IonModal;

  @Input() cartItems: any[] = [];
  @Output() status = new EventEmitter<boolean>();

  selectedBatch: any = {};
  selectedItem: any = {};
  cartId = '';

  totalCartAmount = 0;

  loaderToShow = '';

  showAlert = false;
  itemToDelete: any = {};

  alertDeleteButtons = [
    {
      text: 'Cancel',
      role: 'cancel',
      cssClass: 'alert-reject',
      handler: () => {
        this.showAlert = false;
      }
    },
    {
      text: 'Yes',
      role: 'confirm',
      cssClass: 'alert-accept',
      handler: () => {
        this.showAlert = false;
        this.deleteItem();
      },
    },
  ];

  constructor(private cryptoSrv: CryptoService,
              private apiSrv: ApiService,
              private authSrv: AuthService,
              private toast: ToastService) { }

  ngOnInit() {

    this.cartItems.forEach((element) => {
      // const vat = parseInt(element.vat.toString());
      // if (vat > 0) {
      //   const vat_amount = element.sp / (1 + vat / 100);
      //   this.totalGoodsAmount += parseFloat(
      //     (vat_amount * element.qty).toFixed(0)
      //   );
      // } else {
      //   this.totalGoodsAmount += parseFloat(
      //     (element.sp * element.qty).toFixed(0)
      //   );
      // }

      this.totalCartAmount += parseFloat((element.qty * element.sp).toFixed(0));
      // this.totalCartAmount += element.qty * element.sp;

      // this.totalVAT += this.totalCartAmount - this.totalGoodsAmount;
    });
    
  }

  close() {
    this.status.emit(false);
  }

  trackItems(index: number, item: any) {
    return item.id;
  }

  async editItem(slide: IonItemSliding, item: any) {
    
    this.loaderToShow = item.id;

    await slide.close();

    const request = {
      action: this.cryptoSrv.encryptText('check-lock-status-fast'),
      item_id: item.item.id,
      location_id: item.location.id,
      right: this.cryptoSrv.encryptText("sell_cash"),
      uid: this.authSrv.getUserToken('uid')
    }

    this.apiSrv.read(request).then(async (resp) => {
      if(await this.apiSrv.checkResponseStatus(resp)) {

        item.batches = resp.batches;

        item.batches.forEach((element: any) => {

          element.full_pack = 0;
          element.piece = 0;

          let full_pack=0;
          let piece=0;

          if(resp.sell_unit_type==='Piece') {
            
            element.full_pack = full_pack;
            element.piece = piece;

            // check if item is in cart
            let cart_item = this.cartItems.find(x => x.batch_no === element.batch_no && x.item.id === item.item.id && x.sl_id==element.s_l_id);

            if(cart_item) {
              element.qty =  parseInt(element.qty.toString()) - (parseInt(cart_item.qty.toString()) * cart_item.unit.unit_quantity);
            }

            piece = parseInt(element.qty);

          } else {

            // check if item is in cart
            let cart_item = this.cartItems.find(x => x.batch_no === element.batch_no && x.item.id === item.item.id && x.sl_id==element.s_l_id);

            if(cart_item) {
              element.qty =  parseInt(element.qty.toString()) - (parseInt(cart_item.qty.toString()) * cart_item.unit.unit_quantity);
            }

            if(parseInt(item.item.pack_size)===1) {
              // piece = parseInt(element.qty);
              if(element.sell_unit==='Fullpack') {
                full_pack = parseInt(element.qty);
              } else {
                piece = parseInt(element.qty);
              }
            } else {
              full_pack = Math.floor(parseInt(element.qty)/parseInt(item.item.pack_size));
              piece = parseInt(element.qty) - (full_pack * parseInt(item.item.pack_size));
            }

            
            element.full_pack = full_pack;
            element.piece = piece;
          }
        });

        this.selectedItem = JSON.parse(JSON.stringify(item.item));

        this.selectedBatch = item.batches.find((x: any) => x.s_l_id == item.sl_id);
        this.selectedItem.pack_size = item.item.full_qty;
        this.selectedItem.location_id = item.location.id;
        this.selectedItem.buying_price = this.selectedBatch.buying_price;
        this.cartId = item.id;

        await this.batchModal.present();

      }

      this.loaderToShow = '';
      
    }).catch(error => {
      this.toast.showErrorToast(error);
    });

  }

  async deleteItem() {

    const item = this.itemToDelete;

    this.loaderToShow = this.itemToDelete.id;

    const total_pieces = item.unit.unit_quantity * item.qty;

    const request = {
      action: this.cryptoSrv.encryptText("delete-item-from-cart-new"),
      id: item.id,
      item_id: item.item.id,
      batch_no: this.cryptoSrv.encryptText(item.batch_no),
      tt_qty: this.cryptoSrv.encryptText(total_pieces.toString()),
      location_id: item.location.id,
      added_by: this.authSrv.getUserToken("uid"),
    };

    this.apiSrv.post(request).then(async (resp) => {
      if(await this.apiSrv.checkResponseStatus(resp)) {

        this.cartItems = this.cartItems.filter(x => x.id != item.id);

        this.totalCartAmount = 0;
        this.cartItems.forEach((element) => {
          this.totalCartAmount += parseFloat((element.qty * element.sp).toFixed(0));
        });
        this.loaderToShow = '';

        if(this.cartItems.length==0) {
          this.close();
        }

      }
    }).catch(error => {
      this.toast.showErrorToast(error);
    });

  }


  async batchStatus($event: any) {
    await this.batchModal.dismiss();
  }

  updateItem($event: any) {
    if($event.qty) {
      let item = this.cartItems.find(x => x.id == this.cartId);

      item.qty = $event.qty;
      item.unit.unit_name = $event.unit;
      item.sp = $event.price;
    }

    this.totalCartAmount = 0;
    this.cartItems.forEach((element) => {
      this.totalCartAmount += parseFloat((element.qty * element.sp).toFixed(0));
    });
  }

  async pay() {
    await this.paymentModal.present();
  }

  async paymentStatus($event: any) {
    await this.paymentModal.dismiss();
    if($event==true) {
      this.status.emit(true);
    }
    
  }

}
