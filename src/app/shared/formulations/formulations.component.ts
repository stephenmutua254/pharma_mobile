import { IonModal } from '@ionic/angular/standalone';
import { SharedModules } from 'src/app/shared/shared.module';
import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';
import { InfiniteScrollCustomEvent } from '@ionic/core';
import { SharedComponentsModule } from '../shared-components.module';
import { EditCategoryComponent } from '../edit-category/edit-category.component';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth.service';
import { CryptoService } from 'src/app/services/crypto.service';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-formulations',
  templateUrl: './formulations.component.html',
  styleUrls: ['./formulations.component.scss'],
  imports: [SharedModules, EditCategoryComponent],
  animations: [trigger('enter', [
    transition('* => *', [
      style({ opacity: 0 }),
      animate('1s', style({ opacity: 1 }))
    ])
  ])]
})
export class FormulationsComponent implements OnInit {
  @ViewChild('editCategoryModal') editCategoryModal: IonModal = {} as IonModal;
   
  @Input() type = '';
  @Input() formulations: any[] = [];
  @Output() status = new EventEmitter<{status: boolean, selectedItem?: any}>();
  
  filteredFormulations: any[] = [];

  selectedItem: any = {};
  editType = '';

  showAlert = false;

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
        this.loaderToShow = this.selectedItem.id;
        this.showAlert = false;
        this.deleteItem();
      },
    },
  ];

  loaderToShow = '';

  constructor(private apiSrv: ApiService,
              private authSrv: AuthService,
              private toast: ToastService,
              private cryptoSrv: CryptoService) { }

  ngOnInit() {
    this.filteredFormulations = this.formulations.slice(0, 30);
  }

  close() {
    this.status.emit({status: false});
  }

  filterList(event: any) {
    const searchQuery = event.target.value;
    if (!searchQuery || searchQuery.trim() === '') {
      this.filteredFormulations = this.formulations.slice(0, 30); // Display an initial chunk instead of the entire list
    } else {
      const normalizedQuery = searchQuery.toLowerCase();
      this.filteredFormulations = this.formulations.filter(item =>
        item.name.toLowerCase().includes(normalizedQuery)
        // item.description.includes(normalizedQuery)
      ).slice(0, 30); // Limit the number of items shown for large data sets
    }
  }

  onIonInfinite(event: any) {
    this.generateProducts();
    setTimeout(() => {
      (event as InfiniteScrollCustomEvent).target.complete();
    }, 500);
  }

  generateProducts() {
    let length = this.filteredFormulations.length;
    for (let i = length; i < length + 30; i++) {
      if(this.formulations[i]!=null) {
        this.filteredFormulations.push(this.formulations[i]);
      }
    }
  }

  selectItem(item: any) {
    this.status.emit({status: true, selectedItem: item});
  }

  async newFormulation() {
    this.editType = 'new';
    await this.editCategoryModal.present();
  }

  async editItem(item: any) {
    this.selectedItem = JSON.parse(JSON.stringify(item));
    this.editType = 'edit';
    await this.editCategoryModal.present();
  }

  deleteItem() {

    const request = {
      action: this.cryptoSrv.encryptText('delete_formulation'),
      id: this.selectedItem.id,
      added_by: this.authSrv.getUserToken('uid')
    };

    this.apiSrv.post(request).then(async res => {

      if(await this.apiSrv.checkResponseStatus(res)) {
        this.loaderToShow = '';
        this.formulations = this.formulations.filter(x => x.id !== this.selectedItem.id);
        this.filteredFormulations = this.filteredFormulations.filter(x => x.id !== this.selectedItem.id);
        this.toast.showSuccessToast('Formulation deleted!');
      }

    }).catch(error => {
      this.toast.showErrorToast(error);
    });

  }

  editStatus($event: any) {
    this.editCategoryModal.dismiss();
    if($event.status==true) {

      if(this.editType=='new') {
        this.formulations = $event.items;
        this.filteredFormulations = this.formulations.slice(0, 30);
      } else {
        const item = this.formulations.find(x => x.id === $event.items[0].id);
        const item2 = this.filteredFormulations.find(x => x.id === $event.items[0].id);
        if(item) {
          Object.assign(item, $event.items[0]);
        }
        if(item2) {
          Object.assign(item2, $event.items[0]);
        }
      }
      
    }
  }


}
