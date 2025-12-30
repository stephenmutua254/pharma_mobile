import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { SharedModules } from '../shared.module';
import { IonDatetime } from '@ionic/angular/standalone';
// import { format } from 'date-fns';
import { NgForm } from '@angular/forms';
import { CryptoService } from 'src/app/services/crypto.service';
import { AuthService } from 'src/app/services/auth.service';
import { ApiService } from 'src/app/services/api.service';
import { ToastService } from 'src/app/services/toast.service';
import { format } from 'date-fns';
import { SharedComponentsModule } from '../shared-components.module';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss'],
  imports: [SharedModules, SharedComponentsModule]
})
export class PaymentComponent implements OnInit {
  @ViewChild('datetime1', {static: false}) paymentDate: IonDatetime = {} as IonDatetime;
  
  @Input() totalCartAmount = 0;
  @Input() receiptCustomer = '';
  @Input() customerKRA = '';
  @Input() cartItems: any[] = [];
  
  @Output() status = new EventEmitter<boolean>();

  showNotification = false;

  payMethod = '';
  formError = '';

  showLoader = false;

  loaderToShow = '';
  
  constructor(private authSrv: AuthService,
              private apiSrv: ApiService,
              private toast: ToastService,
              private cryptoSrv: CryptoService
  ) { }

  ngOnInit() {
    this.paymentDate.value = format(new Date(), 'yyyy-MM-dd');
    this.paymentDate.max = new Date().toISOString();
  }

  close() {
    this.status.emit(false);
  }

  confirmPaymentTotal(form: NgForm) {
    if(this.payMethod=='Multiple') {
      
      if((form.value.cash + form.value.mpesa + form.value.bank) == this.totalCartAmount) {
        return true;
      } else {
        return false;
      }
      
    } else if (this.payMethod=='Cash') {
      form.value.cash = this.totalCartAmount;
      form.value.mpesa = 0;
      form.value.bank = 0;
      return true;
    } else if (this.payMethod=='M-pesa') {
      form.value.cash = 0;
      form.value.mpesa = this.totalCartAmount;
      form.value.bank = 0;
      return true;
    } else if (this.payMethod=='Bank') {
      form.value.cash = 0;
      form.value.mpesa = 0;
      form.value.bank = this.totalCartAmount;
      return true;
    }  else {
      return false;
    }

  }


  savePayment(form: NgForm) {

    this.showLoader = true;

    if(isNaN(form.value.mpesa) || form.value.mpesa==null || form.value.mpesa=='') {
      form.value.mpesa = 0;
    }

    if(isNaN(form.value.cash) || form.value.cash==null || form.value.cash=='') {
      form.value.cash = 0;
    }

    if(isNaN(form.value.bank) || form.value.bank==null || form.value.bank=='') {
      form.value.bank = 0;
    }


    const date = typeof this.paymentDate.value == 'string' ? this.paymentDate.value : '';
    const date1 = new Date(date);
    date1.setHours(date1.getHours());
    date1.setMinutes(date1.getMinutes());
    date1.setSeconds(date1.getSeconds());

    if(this.payMethod=='M-pesa') {
      this.payMethod = 'mpesa'
    }

    if(this.payMethod=='Cash') {
      this.payMethod = 'cash'
    }

    if(this.payMethod=='Bank') {
      this.payMethod = 'bank'
    }

    if(this.payMethod=='Multiple') {
      this.payMethod = 'multiple'
    }

    const request: any = {
      action: this.cryptoSrv.encryptText('complete-cash-payment-new'),
      payment_method: this.cryptoSrv.encryptText(this.payMethod),
      cash_amount: this.cryptoSrv.encryptText(form.value.cash.toString()),
      mpesa_amount: this.cryptoSrv.encryptText(form.value.mpesa.toString()),
      bank_amount: this.cryptoSrv.encryptText(form.value.bank.toString()),
      date_of_sale: this.cryptoSrv.encryptText(date1.toLocaleString('sv-SE', {hour12: false})),
      added_by: this.authSrv.getUserToken('uid'),
      customer: this.cryptoSrv.encryptText(this.receiptCustomer),
      customer_kra: this.cryptoSrv.encryptText(this.customerKRA)
    }


    this.apiSrv.post(request).then(async (resp) => {
      if(await this.apiSrv.checkResponseStatus(resp)) {
        this.showNotification = true;
        setTimeout(() => {
          this.status.emit(true);
        }, 1500);
      }
    }).catch(error => {
      this.toast.showErrorToast(error);
    });


  }

}
