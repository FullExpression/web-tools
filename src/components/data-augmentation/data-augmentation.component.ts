import { Component } from '@angular/core';
import { Folder } from '@fullexpression/core';
import { FilesService } from '@fullexpression/core';
import { CanvasService } from '@fullexpression/core';

@Component({
    selector: 'data-augmentation',
    templateUrl: './data-augmentation.component.html',
    styleUrls: ['./data-augmentation.component.scss']
})
export class DataAugmentationComponent {

    private totalNumberOfImages = 0;
    private importedImagesArray = new Array<string>();

    constructor(private filesService: FilesService, private canvasService: CanvasService) { }

    totalNumberOfImagesChanged(event): void {
        this.totalNumberOfImages = event.target.value as number;
    }

    downloadImages(): void {
        this.performeDataAugmentation().then((images) => {
            let folder = new Folder("Images", null, images);
            this.filesService.downloadAsZip(folder);
        });

    }

    importedImages(images: Array<string>): void {
        this.importedImagesArray = images;
    }

    private performeDataAugmentation(): Promise<Array<string>> {
        return new Promise<Array<string>>((resolve) => {
            let suffledArray = this.shuffle(this.importedImagesArray);
            let augmentArray = JSON.parse(JSON.stringify(suffledArray));
            let numberOfImagesToCreate = this.totalNumberOfImages - suffledArray.length;
            let splittedArray = suffledArray.splice(0, numberOfImagesToCreate);
            let numberOfAugmentImages = 0;

            for (let i = 0; i < splittedArray.length; i++) {
                this.augmentImage(splittedArray[0]).then((image) => {
                    augmentArray.push(image);
                    numberOfAugmentImages++;
                    if (numberOfAugmentImages === splittedArray.length) {
                        resolve(augmentArray);
                    }
                });
            }
        });

    }

    private augmentImage(image: string): Promise<string> {
        return new Promise<string>((resolve) => {
            this.canvasService.getHorizontalFlippedImage(image).then((imageFlipped) => {
                resolve(imageFlipped);
            })
        });
    }

    private shuffle(array: Array<any>) {
        let j = 0;
        let x = 0;
        let i = 0;
        for (i = array.length - 1; i > 0; i--) {
            j = Math.floor(Math.random() * (i + 1));
            x = array[i];
            array[i] = array[j];
            array[j] = x;
        }
        return array;
    }
}
