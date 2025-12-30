import { CommonModule } from '@angular/common';
import { NgModule } from "@angular/core";
import {IonicModule} from "@ionic/angular";
import { IonApp, IonRouterOutlet, IonMenu, IonMenuButton, IonItemOptions,
          IonHeader, IonToolbar, IonTitle, IonItemSliding, IonMenuToggle,
          IonContent, IonFab, IonFabButton, IonFabList, IonTextarea, IonActionSheet, IonBadge, IonThumbnail, IonList, IonText, IonInput, IonItem, IonButton,
          IonLabel, IonDatetime, IonAlert, IonModal, IonInfiniteScroll,IonInfiniteScrollContent, IonSearchbar, IonCard, IonCardContent, IonCardTitle, IonCardHeader, IonCardSubtitle, IonIcon, IonAccordionGroup, IonAccordion,
            IonRefresher, IonCheckbox, IonRefresherContent, IonCol, IonItemOption,
            IonGrid, IonDatetimeButton, IonChip, IonSkeletonText, IonRow, IonToast, IonButtons} from '@ionic/angular/standalone';
import { ToastComponent } from "./toast/toast.component";
import { LoadingComponent } from "./loading/loading.component";
import { FormsModule } from '@angular/forms';
import { NotificationComponent } from './notification/notification.component';

@NgModule({
    imports: [CommonModule, FormsModule, IonApp, IonRouterOutlet,
                IonMenu, IonMenuButton, IonHeader, IonToolbar,
                IonContent, IonMenuToggle, IonItemSliding,
                IonList, IonDatetime, IonDatetimeButton, IonChip, IonSearchbar, IonItemOptions,
                IonBadge, IonTextarea, IonCard, IonText, IonCardTitle,
                IonCardHeader, IonModal, IonCardSubtitle, IonThumbnail,
                IonInput, IonItem, IonCheckbox, IonLabel,
                IonIcon, IonInfiniteScroll,IonInfiniteScrollContent,
                IonSkeletonText, IonAccordionGroup, IonAccordion,
                IonRefresher, IonAlert, IonCardContent, IonRefresherContent, IonCol,
                IonToast, IonTitle, IonButton, IonItemOption,
                ToastComponent, NotificationComponent,
                LoadingComponent, IonGrid, IonActionSheet,
                IonRow, IonButtons, IonFab, IonFabButton, IonFabList],
    exports: [CommonModule, FormsModule, IonApp, IonRouterOutlet, IonItemSliding,
                IonMenu, IonTextarea, IonChip, IonSearchbar, IonBadge, IonCardContent,
                IonMenuButton, IonText, IonHeader, IonToolbar,
                IonContent, IonDatetime, IonDatetimeButton, IonMenuToggle, IonCheckbox, IonItemOptions,
                IonList, IonAlert, IonInfiniteScroll,IonInfiniteScrollContent,
                IonCard, IonCardTitle, IonCardHeader, IonCardSubtitle,
                IonThumbnail, IonModal, IonInput, IonItem, IonLabel,
                IonIcon, IonSkeletonText, IonAccordionGroup, IonAccordion,
                IonRefresher, IonRefresherContent, IonCol, IonItemOption,
                IonGrid, IonRow, IonToast, IonTitle, IonButton,
                ToastComponent, NotificationComponent, IonActionSheet,
                LoadingComponent, IonButtons, IonFab, IonFabButton, IonFabList],
    
})

export class SharedModules {}