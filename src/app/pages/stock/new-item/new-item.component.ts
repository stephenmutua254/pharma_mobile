import { IonModal } from '@ionic/angular/standalone';
import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { SharedModules } from 'src/app/shared/shared.module';
import { CategoriesComponent } from './categories/categories.component';
import { FormulationsComponent } from './formulations/formulations.component';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth.service';
import { CryptoService } from 'src/app/services/crypto.service';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-new-item',
  templateUrl: './new-item.component.html',
  styleUrls: ['./new-item.component.scss'],
  imports: [SharedModules, CategoriesComponent, FormulationsComponent]
})
export class NewItemComponent implements OnInit {
  @ViewChild('newForm', {static: false}) newForm: NgForm = {} as NgForm;
  @ViewChild('newForm2', {static: false}) newForm2: NgForm = {} as NgForm;
  @ViewChild('categoriesModal') categoriesModal: IonModal = {} as IonModal;
  @ViewChild('formulationsModal') formulationsModal: IonModal = {} as IonModal;
    
  @Input() type = '';
  @Input() selectedItem: any = {};
  @Input() categories: any[] = [];
  @Input() formulations: any[] = [];
  @Input() vat_records: any[] = [];

  defaultItem: any = {};

  @Output() status = new EventEmitter<{status: boolean, item?: any}>();
  
  showNotification = false;
  showLoader = false;

  constructor(private apiSrv: ApiService,
                private authSrv: AuthService,
                private toast: ToastService,
                private cryptoSrv: CryptoService) { }

  ngOnInit() {
    if(this.type=='edit') {
      this.defaultItem = JSON.parse(JSON.stringify(this.selectedItem));
    } else {
      this.selectedItem.name = '';
      this.selectedItem.api = '';
      this.selectedItem.category = {name: ''};
      this.selectedItem.pack_size = '';
      this.selectedItem.strength = '';
      this.selectedItem.formulation = '';
      this.selectedItem.sell_unit = 'Fullpack and piece';
      this.selectedItem.full_qty = 1;
      this.selectedItem.default_price = 0;
    }
  }

  close() {
    this.status.emit({status: false})
  }

  async openCategories() {
    await this.categoriesModal.present();
  }

  async openFormulations() {
    await this.formulationsModal.present();
  }

  addNewItem() {
    this.showLoader = true;

    const vat = this.vat_records.find(x => x.vat_percent == 0);

    if(this.selectedItem.sell_unit=='Fullpack' || this.selectedItem.sell_unit=='Piece') {
      this.selectedItem.full_qty=1
    }
    
    const request = {
      action: this.cryptoSrv.encryptText('add_stock_item'),
      name: this.cryptoSrv.encryptText(this.selectedItem.name),
      api: this.cryptoSrv.encryptText(this.selectedItem.api),
      pack_size: this.cryptoSrv.encryptText(this.selectedItem.pack_size),
      strength: this.cryptoSrv.encryptText(this.selectedItem.strength),
      formulation: this.selectedItem.formulation.id,
      category_id: this.selectedItem.category.id,
      category_name: this.cryptoSrv.encryptText(this.selectedItem.category.name),
      full_qty: this.selectedItem.full_qty,
      default_price: this.selectedItem.default_price,
      buying_vat: vat.vat_percent,
      selling_vat: vat.vat_percent,
      alert_unit: 'Full pack',
      alert_quantity: 1,
      controlled: '0',
      added_by: this.authSrv.getUserToken('uid')
    };

    this.apiSrv.post(request).then(async res => {

      if(await this.apiSrv.checkResponseStatus(res)) {
        this.showNotification = true;
        setTimeout(() => {
          this.status.emit({status: true, item: this.selectedItem});
        }, 1500);
      }

    }).catch(error => {
      this.toast.showErrorToast(error);
    });

  }

  updateItem() {

    this.showLoader = true;

    if(this.selectedItem.sell_unit=='Fullpack' || this.selectedItem.sell_unit=='Piece') {
      this.selectedItem.full_qty=1
    }

    if(!this.selectedItem.formulation.name) {
      this.selectedItem.formulation = this.formulations.find(x => x.name === this.selectedItem.formulation)
    }

    const request = {
      action: this.cryptoSrv.encryptText('update_stock_item'),
      id: this.selectedItem.id,
      slid: this.selectedItem.slid,
      name: this.cryptoSrv.encryptText(this.selectedItem.name),
      name1: this.cryptoSrv.encryptText(this.defaultItem.name),
      category_id: this.selectedItem.category.id,
      category_id1: this.defaultItem.category.id,
      api: this.cryptoSrv.encryptText(this.selectedItem.api),
      pack_size: this.cryptoSrv.encryptText(this.selectedItem.pack_size),
      strength: this.cryptoSrv.encryptText(this.selectedItem.strength),
      formulation: this.selectedItem.formulation.id,
      sell_unit: this.cryptoSrv.encryptText(this.selectedItem.sell_unit.toString()),
      full_qty: this.cryptoSrv.encryptText(this.selectedItem.full_qty.toString()),
      default_price: this.cryptoSrv.encryptText(this.selectedItem.default_price.toString()),
      buying_vat: this.cryptoSrv.encryptText(this.selectedItem.buying_vat_percent.toString()),
      selling_vat: this.cryptoSrv.encryptText(this.selectedItem.selling_vat_percent.toString()),
      controlled: this.cryptoSrv.encryptText(this.selectedItem.controlled),
      added_by: this.authSrv.getUserToken('uid')
    };


    this.apiSrv.post(request).then(async res => {

      if(await this.apiSrv.checkResponseStatus(res)) {
        this.showNotification = true;
        setTimeout(() => {
          this.status.emit({status: true, item: this.selectedItem});
        }, 1500);
      }

    }).catch(error => {
      this.toast.showErrorToast(error);
    });

  }

  async categoryStatus($event: any) {
    await this.categoriesModal.dismiss();
    if($event.status==true) {
      this.selectedItem.category = $event.selectedItem;
    }
  }

  async formulationStatus($event: any) {
    await this.formulationsModal.dismiss();
    if($event.status==true) {
      this.selectedItem.formulation = $event.selectedItem;
    }
  }

}
