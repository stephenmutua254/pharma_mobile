import { NgModule } from '@angular/core';
import { CategoriesComponent } from './categories/categories.component';
import { FormulationsComponent } from './formulations/formulations.component';
import { NotificationComponent } from './notification/notification.component';
import { ToastComponent } from "./toast/toast.component";
import { LoadingComponent } from "./loading/loading.component";
import { EditCategoryComponent } from './edit-category/edit-category.component';

@NgModule({
  imports: [
    NotificationComponent,
    CategoriesComponent,
    FormulationsComponent,
    ToastComponent,
    LoadingComponent,
    EditCategoryComponent
  ],
  exports: [
    NotificationComponent,
    CategoriesComponent,
    FormulationsComponent,
    ToastComponent,
    LoadingComponent,
    EditCategoryComponent
  ]
})
export class SharedComponentsModule { }
