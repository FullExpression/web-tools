import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'test-model-import-images',
    templateUrl: './import-images.test-model.component.html',
    styleUrls: ['./import-images.test-model.component.scss']
})
export class TestModelImportImages {

    @Input()
    title: string;
    
    @Output()
    onImportedImages = new EventEmitter<Array<string>>();

    images = new Array<string>();

    constructor() {}

    importedImages(images: Array<string>): void {
        this.images = images;
        this.onImportedImages.emit(images);
    }
}
