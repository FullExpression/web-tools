import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CNNService } from '@fullexpression/emotionclassification';

@Component({
    selector: 'train-import-images',
    templateUrl: './import-images.train.component.html',
    styleUrls: ['./import-images.train.component.scss']
})
export class TrainImportImages {

    @Input()
    title: string;

    @Output()
    onImportedImages = new EventEmitter<Array<string>>();

    images = new Array<string>();

    constructor(private cnnService: CNNService) { }

    importedImages(images: Array<string>): void {
        this.images = images;
        this.onImportedImages.emit(images);
    }
}
