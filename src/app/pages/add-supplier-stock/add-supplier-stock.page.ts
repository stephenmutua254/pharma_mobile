import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';

@Component({
  selector: 'app-add-supplier-stock',
  templateUrl: './add-supplier-stock.page.html',
  styleUrls: ['./add-supplier-stock.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class AddSupplierStockPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
