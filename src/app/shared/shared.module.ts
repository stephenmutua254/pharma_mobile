import { CommonModule } from '@angular/common';
import { NgModule } from "@angular/core";
import {IonicModule} from "@ionic/angular";
import { IonApp, IonRouterOutlet, IonMenu, IonMenuButton,
          IonHeader, IonToolbar, IonTitle, IonMenuToggle,
          IonContent, IonBadge, IonThumbnail, IonList, IonText, IonInput, IonItem, IonButton,
          IonLabel, IonModal, IonInfiniteScroll,IonInfiniteScrollContent, IonSearchbar, IonCard, IonCardContent, IonCardTitle, IonCardHeader, IonCardSubtitle, IonIcon, IonAccordionGroup, IonAccordion,
            IonRefresher, IonCheckbox, IonRefresherContent, IonCol,
            IonGrid, IonChip, IonSkeletonText, IonRow, IonToast, IonButtons} from '@ionic/angular/standalone';
import { ToastComponent } from "./toast/toast.component";
import { LoadingComponent } from "./loading/loading.component";
import { FormsModule } from '@angular/forms';
// import { ItemBatchesComponent } from './item-batches/item-batches.component';
// import { BatchFormComponent } from './batch-form/batch-form.component';

@NgModule({
    imports: [CommonModule, FormsModule, IonApp, IonRouterOutlet,
                IonMenu, IonMenuButton, IonHeader, IonToolbar,
                IonContent, IonMenuToggle,
                IonList, IonChip, IonSearchbar,
                IonBadge, IonCard, IonText, IonCardTitle,
                IonCardHeader, IonModal, IonCardSubtitle, IonThumbnail,
                IonInput, IonItem, IonCheckbox, IonLabel,
                IonIcon, IonInfiniteScroll,IonInfiniteScrollContent,
                IonSkeletonText, IonAccordionGroup, IonAccordion,
                IonRefresher, IonCardContent, IonRefresherContent, IonCol,
                IonToast, IonTitle, IonButton,
                ToastComponent, LoadingComponent, IonGrid,
                IonRow, IonButtons],
    exports: [CommonModule, FormsModule, IonApp, IonRouterOutlet,
                IonMenu, IonChip, IonSearchbar, IonBadge, IonCardContent,
                IonMenuButton, IonText, IonHeader, IonToolbar,
                IonContent, IonMenuToggle, IonCheckbox,
                IonList, IonInfiniteScroll,IonInfiniteScrollContent,
                IonCard, IonCardTitle, IonCardHeader, IonCardSubtitle,
                IonThumbnail, IonModal, IonInput, IonItem, IonLabel,
                IonIcon, IonSkeletonText, IonAccordionGroup, IonAccordion,
                IonRefresher, IonRefresherContent, IonCol,
                IonGrid, IonRow, IonToast, IonTitle, IonButton,
                ToastComponent, LoadingComponent, IonButtons],
    
})

export class SharedModules {}