import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SharedModules } from '../shared.module';

@Component({
  selector: 'app-batch-form',
  templateUrl: './batch-form.component.html',
  styleUrls: ['./batch-form.component.scss'],
  imports: [SharedModules]
})
export class BatchFormComponent implements OnInit {
  @Input() selectedBatch: any = {};
  @Output() status = new EventEmitter<boolean>();

  quantity = '';
  price = 0;
  unit = '';

  showNotification = false;

  constructor() { }

  ngOnInit() {
    this.unit = '';
    this.price = parseFloat(this.selectedBatch.sell_price);
    this.selectedBatch.buying_price = parseFloat(this.selectedBatch.buying_price);
    console.log(this.selectedBatch)
  }

  close() {
    this.status.emit(false);
  }

  saveItemBatch() {
    
  }

}
