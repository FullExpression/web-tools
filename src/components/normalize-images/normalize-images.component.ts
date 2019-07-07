import { Component, ChangeDetectorRef } from '@angular/core';
import { FacesService } from '@fullexpression/emotionclassification';
import { FilesService } from '@fullexpression/core';
import { Folder } from '@fullexpression/core';
import { ImageModel } from '@fullexpression/core';
import { ImageNormalizerService } from '@fullexpression/emotionclassification';
import { Size } from '@fullexpression/core';
import { CanvasService } from '@fullexpression/core';

@Component({
    selector: 'normalize-images',
    templateUrl: './normalize-images.component.html',
    styleUrls: ['./normalize-images.component.scss']
})
export class NomralizeImageComponent {
    images = new Array<string>();
    private faces = new Array<string>();
    private normalizedImages = new Array<string>();
    private normalizedImageWith = 300;
    private normalizedImageHeight = 300;
    showDragAndDrop = true;

    private numberOfImages = -1;
    private numberOfFoundFaces = -1;
    private facesPerImage = -1.0;
    private numberImagesWithoutFaces = -1;
    private progressiveBarValue = 0;
    isLoading = false;
    private loadingMessage = "";

    constructor(private facesService: FacesService,
        private filesService: FilesService,
        private imageNormalizer: ImageNormalizerService,
        private canvasService: CanvasService,
        private changeDetectorRef: ChangeDetectorRef
    ) { }

    refreshNormalizedImages() {
        this.normalizedImages = new Array<string>();
        this.imageNormalizer.normalizeImages(this.faces,
            new Size(this.normalizedImageWith, this.normalizedImageHeight))
            .subscribe((normalizedImages) => {
                this.normalizedImages = this.normalizedImages.concat(normalizedImages);
            });
    }

    normalizedImageWithChanged(event) {
        this.normalizedImageWith = event.target.value;
    }
    normalizedImageheightChanged(event) {
        this.normalizedImageHeight = event.target.value;
    }

    importedImages(images: Array<string>): void {
        this.showDragAndDrop = false;
        this.images = images;
        this.numberOfImages = images.length;
        this.isLoading = true;
        setTimeout(() => {
            this.loadingMessage = "Analizing images...";
            this.canvasService.getCanvasImages(images).then((canvasArray) => {
                let mappedImages = canvasArray.map((canvasModel) => {
                    let canvas = this.canvasService.createCanvas(canvasModel.canvas.width * 1.6,
                        canvasModel.canvas.height * 1.6).canvas;
                    let context = canvas.getContext('2d');
                    context.drawImage(canvasModel.canvas, canvasModel.canvas.width * 0.3,
                        canvasModel.canvas.height * 0.3)
                    return new ImageModel(this.canvasService.getImageUrl(canvas));
                });
                let numberOfProcessedImages = 0;
                this.loadingMessage = "Finding faces...";
                this.facesService.findFaces(mappedImages).then((faces) => {
                    setTimeout(() => {
                        this.loadingMessage = "Finding faces...";
                        faces.forEach((facesImage) => {
                            if (facesImage.faces.length === 0) {
                                this.numberImagesWithoutFaces++;
                                numberOfProcessedImages++;
                            } else {
                                this.faces = this.faces.concat(facesImage.faces);
                                this.loadingMessage = "Normalizing images...";
                                this.imageNormalizer.normalizeImages(facesImage.faces,
                                    new Size(this.normalizedImageWith, this.normalizedImageHeight))
                                    .subscribe((normalizedImages) => {
                                        this.normalizedImages = this.normalizedImages.concat(normalizedImages);
                                        numberOfProcessedImages++;
                                        this.progressiveBarValue = (numberOfProcessedImages / this.numberOfImages) * 100;
                                        if (faces.length === numberOfProcessedImages) {
                                            this.isLoading = false;
                                        }
                                    });
                            }

                        });
                        this.numberOfFoundFaces = this.faces.length;
                        if (this.numberOfImages > 0 && this.numberOfFoundFaces) {
                            this.facesPerImage = this.numberOfFoundFaces / this.numberOfImages;
                        } else {
                            this.facesPerImage = 0;
                        }
                    });
                });
            })

        });


    }
    downloadImages(): void {
        let folder = new Folder("Images", new Array<Folder>(
            new Folder('Faces', null, this.faces),
            new Folder('NormalizedImages', null, this.normalizedImages),
        ));
        this.filesService.downloadAsZip(folder);
    }
    uploadNewImages() {
        this.images = new Array<string>();
        this.faces = new Array<string>();
        this.normalizedImages = new Array<string>();
        this.showDragAndDrop = true;
        this.numberOfImages = -1;
        this.numberOfFoundFaces = -1;
        this.facesPerImage = -1.0;
        this.numberImagesWithoutFaces = -1;
        this.progressiveBarValue = 0;
    }
}
