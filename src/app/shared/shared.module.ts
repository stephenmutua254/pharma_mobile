import { CommonModule } from '@angular/common';
import { NgModule } from "@angular/core";
import {IonicModule} from "@ionic/angular";
import { IonApp, IonRouterOutlet, IonMenu, IonMenuButton,
          IonHeader, IonToolbar, IonTitle, IonMenuToggle,
          IonContent, IonList, IonInput, IonItem, IonButton,
          IonLabel, IonIcon, IonAccordionGroup, IonAccordion,
            IonRefresher, IonRefresherContent, IonCol,
            IonGrid, IonRow, IonToast, IonButtons} from '@ionic/angular/standalone';
import { ToastComponent } from "./toast/toast.component";
import { LoadingComponent } from "./loading/loading.component";
import { FormsModule } from '@angular/forms';
import { provideHttpClient } from '@angular/common/http';

@NgModule({
    imports: [CommonModule, FormsModule, IonApp, IonRouterOutlet,
                IonMenu, IonMenuButton, IonHeader, IonToolbar,
                IonContent, IonMenuToggle,
                IonList, IonInput, IonItem, IonLabel,
                IonIcon, IonAccordionGroup, IonAccordion,
                IonRefresher, IonRefresherContent, IonCol,
                IonToast, IonTitle, IonButton,
                ToastComponent, LoadingComponent, IonGrid,
                IonRow, IonButtons],
    exports: [CommonModule, FormsModule, IonApp, IonRouterOutlet,
                IonMenu, IonMenuButton, IonHeader, IonToolbar,
                IonContent, IonMenuToggle,
                IonList, IonInput, IonItem, IonLabel,
                IonIcon, IonAccordionGroup, IonAccordion,
                IonRefresher, IonRefresherContent, IonCol,
                IonGrid, IonRow, IonToast, IonTitle, IonButton,
                ToastComponent, LoadingComponent, IonButtons],
    
})

export class SharedModules {

}