import { IonSearchbar, IonModal } from '@ionic/angular/standalone';
import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { SharedModules } from 'src/app/shared/shared.module';
import { trigger, transition, style, animate } from '@angular/animations';
import { BatchFormEditComponent } from './batch-form-edit/batch-form-edit.component';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-batch-purchases',
  templateUrl: './batch-purchases.component.html',
  styleUrls: ['./batch-purchases.component.scss'],
  imports: [SharedModules, BatchFormEditComponent],
  animations: [trigger('enter', [
    transition('* => *', [
      style({ opacity: 0 }),
      animate('1s', style({ opacity: 1 }))
    ])
  ])]
})
export class BatchPurchasesComponent implements OnInit {
  @ViewChild('editItemModal') editItemModal: IonModal = {} as IonModal;
  @Input() selectedItem: any = {};
  @Input() vat_records: any[] = [];
  @Output() status = new EventEmitter<{status: boolean, item: any}>();


  selectedBatch: any = {};
  openItemActions = false;
  editType = '';

  itemActions = [
    {
      text: 'Edit batch',
      icon: 'pencil-outline',
      handler: () => {
        this.openItemActions = false;
        this.editType = 'edit';
        this.editItemModal.present();
      },
      data: {
        action: 'edit'
      }
    },
    {
      text: 'Edit selling price',
      icon: 'cash-outline',
      handler: () => {
        this.openItemActions = false;
        this.editType = 'price';
        this.editItemModal.present();
      },
      data: {
        action: 'batches'
      }
    },
  ];

  edited = false;
    
  constructor(private toast: ToastService) { }

  ngOnInit() {}

  close() {
    this.status.emit({status: this.edited, item: this.selectedItem});
  }

  selectBatch(item: any) {
    if(item.location_quantity>0) {
      this.selectedBatch = JSON.parse(JSON.stringify(item));
      this.openItemActions = true;
    } else {
      this.toast.showWariningToast('Batch has no quantity!');
    }
  }

  getLocationUnitQuantity(total_pieces: number, item_selling_units: any[]) {

    const units_qty: any = {};

    item_selling_units = item_selling_units.sort((a, b) => b.unit_quantity - a.unit_quantity);

    item_selling_units.forEach(element => {

      if(total_pieces > 0) {
        const unit_qty = Math.floor(total_pieces / element.unit_quantity);
        units_qty[element.unit_name] = unit_qty;
  
        total_pieces = total_pieces - (unit_qty * element.unit_quantity);
      } else {
        units_qty[element.unit_name] = 0;
      }
      
    });

    return units_qty;
  }

  getUnitSellingPrice(item: any) {

    if(this.selectedItem.sell_unit=='Fullpack') {
      let price = item.selling_prices.find((x: any) => x.unit.unit_name == 'Full pack');
      return price.recom_selling_price;
    }

    if(this.selectedItem.sell_unit=='Piece') {
      let price = item.selling_prices.find((x: any) => x.unit.unit_name == 'Piece');
      return price.recom_selling_price;
    }

    let price = item.selling_prices.find((x: any) => x.unit.unit_name == 'Full pack');
    return price.recom_selling_price;
    
  }

  async editStatus($event: any) {
    await this.editItemModal.dismiss();
    if($event.status==true) {
      
      let batch = this.selectedItem.locations_qty.find((x: any) => x.id == $event.batch.id);
      if(batch) {
        Object.assign(batch, $event.batch);
      }

      this.edited = true;
    }
  }

}
