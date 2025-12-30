import { SharedModules } from 'src/app/shared/shared.module';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-formulations',
  templateUrl: './formulations.component.html',
  styleUrls: ['./formulations.component.scss'],
  imports: [SharedModules],
  animations: [trigger('enter', [
    transition('* => *', [
      style({ opacity: 0 }),
      animate('1s', style({ opacity: 1 }))
    ])
  ])]
})
export class FormulationsComponent implements OnInit {
  @Input() type = '';
  @Input() formulations: any[] = [];
  @Output() status = new EventEmitter<{status: boolean, selectedItem?: any}>();
  
  constructor() { }

  ngOnInit() {}

  close() {
    this.status.emit({status: false});
  }

  selectItem(item: any) {
    this.status.emit({status: true, selectedItem: item});
  }

  editItem(item: any) {

  }

  deleteItem(item: any) {

  }

}
