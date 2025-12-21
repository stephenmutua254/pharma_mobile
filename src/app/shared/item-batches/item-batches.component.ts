import { IonModal } from '@ionic/angular/standalone';
import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { SharedModules } from '../shared.module';
import { BatchFormComponent } from '../../shared/batch-form/batch-form.component';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-item-batches',
  templateUrl: './item-batches.component.html',
  styleUrls: ['./item-batches.component.scss'],
  imports: [SharedModules, BatchFormComponent],
  
  animations: [trigger('enter', [
    transition('* => *', [
      style({ opacity: 0 }),
      animate('1s', style({ opacity: 1 }))
    ])
  ])]
})
export class ItemBatchesComponent implements OnInit {
  @Input() selectedItem: any = {};
  @Input() batches: any = [];
  @Output() status = new EventEmitter<boolean>();
  @ViewChild('batchModal') batchModal: IonModal = {} as IonModal;

  selectedBatch: any = {};
  
  constructor() { }

  ngOnInit() {
  }

  close() {
    this.status.emit(false);
  }

  async selectBatch(item: any) {
    this.selectedBatch = item;
    this.selectedBatch.min_price = this.selectedItem.min_price;
    this.selectedBatch.sell_price = this.selectedItem.recom_price;
    await this.batchModal.present();
  }

  async batchStatus($event: any) {
    await this.batchModal.dismiss();
  }

}
