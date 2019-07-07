import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from '../components/app/app.component';
import { MaterialModule } from './material.module';
import { CoreModule, CanvasService, FilesService } from '@fullexpression/core';
import { DataAugmentationComponent } from '../components/data-augmentation/data-augmentation.component';
import { NomralizeImageComponent } from '../components/normalize-images/normalize-images.component';
import { TestModelComponent } from '../components/test-model/test-model.component';
import { TrainComponent } from '../components/train/train.component';
import { TrainImportImages } from '../components/train/import-images/import-images.train.component';
import { ConfusionMatrixModule } from '@fullexpression/confusionmatrix';
import { FormsModule } from '@angular/forms';
import { KeysPipe } from '../components/pipes/keys.pipe';
import { EmotionClassificationModule } from '@fullexpression/emotionclassification';
import { TestModelImportImages } from '../components/test-model/import-images/import-images.test-model.component';

@NgModule({
    declarations: [
        AppComponent,
        DataAugmentationComponent,
        NomralizeImageComponent,
        TestModelComponent,
        TrainComponent,
        TrainImportImages,
        TestModelImportImages,
        KeysPipe
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        MaterialModule,
        CoreModule.forRoot(),
        EmotionClassificationModule.forRoot(),
        ConfusionMatrixModule,
        FormsModule
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { }
