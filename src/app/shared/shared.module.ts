import { CommonModule } from '@angular/common';
import { NgModule } from "@angular/core";
import {IonicModule} from "@ionic/angular";
import { IonApp, IonRouterOutlet, IonMenu, IonMenuButton,
          IonHeader, IonToolbar, IonTitle, IonMenuToggle,
          IonContent, IonBadge, IonThumbnail, IonList, IonText, IonInput, IonItem, IonButton,
          IonLabel, IonInfiniteScroll,IonInfiniteScrollContent, IonSearchbar, IonCard, IonCardContent, IonCardTitle, IonCardHeader, IonCardSubtitle, IonIcon, IonAccordionGroup, IonAccordion,
            IonRefresher, IonRefresherContent, IonCol,
            IonGrid, IonChip, IonSkeletonText, IonRow, IonToast, IonButtons} from '@ionic/angular/standalone';
import { ToastComponent } from "./toast/toast.component";
import { LoadingComponent } from "./loading/loading.component";
import { FormsModule } from '@angular/forms';

@NgModule({
    imports: [CommonModule, FormsModule, IonApp, IonRouterOutlet,
                IonMenu, IonMenuButton, IonHeader, IonToolbar,
                IonContent, IonMenuToggle,
                IonList, IonChip, IonSearchbar, IonBadge, IonCard, IonText, IonCardTitle, IonCardHeader, IonCardSubtitle, IonThumbnail, IonInput, IonItem, IonLabel,
                IonIcon, IonInfiniteScroll,IonInfiniteScrollContent, IonSkeletonText, IonAccordionGroup, IonAccordion,
                IonRefresher, IonCardContent, IonRefresherContent, IonCol,
                IonToast, IonTitle, IonButton,
                ToastComponent, LoadingComponent, IonGrid,
                IonRow, IonButtons],
    exports: [CommonModule, FormsModule, IonApp, IonRouterOutlet,
                IonMenu, IonChip, IonSearchbar, IonBadge, IonCardContent, IonMenuButton, IonText, IonHeader, IonToolbar,
                IonContent, IonMenuToggle,
                IonList, IonInfiniteScroll,IonInfiniteScrollContent, IonCard, IonCardTitle, IonCardHeader, IonCardSubtitle, IonThumbnail, IonInput, IonItem, IonLabel,
                IonIcon, IonSkeletonText, IonAccordionGroup, IonAccordion,
                IonRefresher, IonRefresherContent, IonCol,
                IonGrid, IonRow, IonToast, IonTitle, IonButton,
                ToastComponent, LoadingComponent, IonButtons],
    
})

export class SharedModules {}