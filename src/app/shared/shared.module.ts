import { CommonModule } from '@angular/common';
import { NgModule } from "@angular/core";
import {IonicModule} from "@ionic/angular";
import { IonApp, IonRouterOutlet, IonMenu, IonMenuButton,
          IonHeader, IonToolbar, IonTitle, IonMenuToggle,
          IonContent, IonBadge, IonThumbnail, IonList, IonText, IonInput, IonItem, IonButton,
          IonLabel, IonCard, IonCardContent, IonCardTitle, IonCardHeader, IonCardSubtitle, IonIcon, IonAccordionGroup, IonAccordion,
            IonRefresher, IonRefresherContent, IonCol,
            IonGrid, IonSkeletonText, IonRow, IonToast, IonButtons} from '@ionic/angular/standalone';
import { ToastComponent } from "./toast/toast.component";
import { LoadingComponent } from "./loading/loading.component";
import { FormsModule } from '@angular/forms';

@NgModule({
    imports: [CommonModule, FormsModule, IonApp, IonRouterOutlet,
                IonMenu, IonMenuButton, IonHeader, IonToolbar,
                IonContent, IonMenuToggle,
                IonList, IonBadge, IonCard, IonText, IonCardTitle, IonCardHeader, IonCardSubtitle, IonThumbnail, IonInput, IonItem, IonLabel,
                IonIcon, IonSkeletonText, IonAccordionGroup, IonAccordion,
                IonRefresher, IonCardContent, IonRefresherContent, IonCol,
                IonToast, IonTitle, IonButton,
                ToastComponent, LoadingComponent, IonGrid,
                IonRow, IonButtons],
    exports: [CommonModule, FormsModule, IonApp, IonRouterOutlet,
                IonMenu, IonBadge, IonCardContent, IonMenuButton, IonText, IonHeader, IonToolbar,
                IonContent, IonMenuToggle,
                IonList, IonCard, IonCardTitle, IonCardHeader, IonCardSubtitle, IonThumbnail, IonInput, IonItem, IonLabel,
                IonIcon, IonSkeletonText, IonAccordionGroup, IonAccordion,
                IonRefresher, IonRefresherContent, IonCol,
                IonGrid, IonRow, IonToast, IonTitle, IonButton,
                ToastComponent, LoadingComponent, IonButtons],
    
})

export class SharedModules {

}