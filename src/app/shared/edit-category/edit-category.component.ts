import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth.service';
import { CryptoService } from 'src/app/services/crypto.service';
import { ToastService } from 'src/app/services/toast.service';
import { SharedModules } from '../shared.module';
import { NgForm } from '@angular/forms';
import { NotificationComponent } from '../notification/notification.component';

@Component({
  selector: 'app-edit-category',
  templateUrl: './edit-category.component.html',
  styleUrls: ['./edit-category.component.scss'],
  imports: [SharedModules, NotificationComponent]
})
export class EditCategoryComponent implements OnInit {

  @Input() selectedCategory: any = {};
  @Input() selectedFormulation: any = {};
  @Input() group: any = '';
  @Input() type: any = '';

  @Output() status = new EventEmitter<{status: boolean, items?: any[]  }>();


  showLoader = false;
  newName = '';

  showNotification = false;
  message = '';

  constructor(private apiSrv: ApiService,
              private authSrv: AuthService,
              private toast: ToastService,
              private cryptoSrv: CryptoService) { }

  ngOnInit() {
  }

  close() {
    this.status.emit({status: false});
  }

  get activeSelection() {
    return this.group === 'category' ? this.selectedCategory : this.selectedFormulation;
  }

  addCategory(form: NgForm) {
    this.showLoader = true;

    const request = {
      action: this.cryptoSrv.encryptText('add_category'),
      category: this.cryptoSrv.encryptText(form.value.name),
      added_by: this.authSrv.getUserToken('uid')
    };

    this.apiSrv.post(request).then(async res => {

      if(await this.apiSrv.checkResponseStatus(res)) {
        
        this.message = 'Category added!';
        this.showNotification = true;
        setTimeout(() => {
          this.status.emit({status: true, items: res.records});
        }, 1500);
      }

      this.showLoader = false;

    }).catch(error => {
      this.showLoader = false;
      this.toast.showErrorToast(error);
    });
  }

  updateCategory(form: NgForm) {
    this.showLoader = true;

    const request = {
      action: this.cryptoSrv.encryptText('update_category'),
      id: this.selectedCategory.id,
      category: this.cryptoSrv.encryptText(form.value.name),
      added_by: this.authSrv.getUserToken('uid')
    };
    
    this.apiSrv.post(request).then(async res => {

      if(await this.apiSrv.checkResponseStatus(res)) {
        this.selectedCategory.name = form.value.name;
        this.message = 'Category updated!';
        this.showNotification = true;
        setTimeout(() => {
          this.status.emit({status: true, items: [this.selectedCategory]});
        }, 1500);
      }

    }).catch(error => {
      this.toast.showErrorToast(error);
    });
  }


  addFormulation(form: NgForm) {

    this.showLoader = true;

    const request = {
      action: this.cryptoSrv.encryptText('add_formulation'),
      name: this.cryptoSrv.encryptText(form.value.name),
      added_by: this.authSrv.getUserToken('uid')
    };

    this.apiSrv.post(request).then(async res => {

      if(await this.apiSrv.checkResponseStatus(res)) {
        
        let i = res.records.length-1;
        while(i>-1) {
          res.records[i].name = this.cryptoSrv.decryptText(res.records[i].name);
          i--;
        }

        this.message = 'Formulation added!';
        this.showNotification = true;
        setTimeout(() => {
          this.status.emit({status: true, items: res.records});
        }, 1500);
      }

      this.showLoader = false;

    }).catch(error => {
      this.showLoader = false;
      this.toast.showErrorToast(error);
    });

  }

  updateFormulation(form: NgForm) {
    this.showLoader = true;

    const request = {
      action: this.cryptoSrv.encryptText('update_formulation'),
      id: this.selectedFormulation.id,
      name: this.cryptoSrv.encryptText(form.value.name),
      added_by: this.authSrv.getUserToken('uid')
    };
    
    this.apiSrv.post(request).then(async res => {

      if(await this.apiSrv.checkResponseStatus(res)) {
        this.selectedFormulation.name = form.value.name;
        this.message = 'Formulation updated!';
        this.showNotification = true;
        setTimeout(() => {
          this.status.emit({status: true, items: [this.selectedFormulation]});
        }, 1500);
      }

    }).catch(error => {
      this.toast.showErrorToast(error);
    });
  }

}
