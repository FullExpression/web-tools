import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TrainComponent } from '../components/train/train.component';
import { NomralizeImageComponent } from '../components/normalize-images/normalize-images.component';
import { TestModelComponent } from '../components/test-model/test-model.component';
import { DataAugmentationComponent } from '../components/data-augmentation/data-augmentation.component';

const routes: Routes = [
    { path: 'train', component: TrainComponent },
    { path: 'normalize-images', component: NomralizeImageComponent },
    { path: 'test-model', component: TestModelComponent },
    { path: 'data-augmentation', component: DataAugmentationComponent }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
