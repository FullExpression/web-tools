import { Component, ChangeDetectorRef } from '@angular/core';
import { CNNService } from '@fullexpression/emotionclassification';
import { Observable } from 'rxjs';

@Component({
    selector: 'train-component',
    templateUrl: './train.component.html',
    styleUrls: ['./train.component.scss']
})
export class TrainComponent {
    private afraidImages = new Array<string>();
    private angryImages = new Array<string>();
    private disgustedImages = new Array<string>();
    private happyImages = new Array<string>();
    private neutralImages = new Array<string>();
    private sadImages = new Array<string>();
    private suprisedImages = new Array<string>();
    loadingMessage = "";
    isLoading = false;
    trainingMode = false;
    constructor(private cnnService: CNNService,
        private changeDetectorRef: ChangeDetectorRef) { }

    trainAgain(): void {
        this.trainingMode = false;
    }

    importAfraidImages(images: Array<string>): void {
        this.afraidImages = images;
    }

    importAngryImages(images: Array<string>): void {
        this.angryImages = images;
    }

    importDisgustedImages(images: Array<string>): void {
        this.disgustedImages = images;
    }

    importHappyImages(images: Array<string>): void {
        this.happyImages = images;
    }

    importNeutralImages(images: Array<string>): void {
        this.neutralImages = images;
    }

    importSadImages(images: Array<string>): void {
        this.sadImages = images;
    }

    importSuprisedImages(images: Array<string>): void {
        this.suprisedImages = images;
    }

    download(): void {
        this.cnnService.saveModel();
    }

    training(): void {
        this.trainingMode = true;
        this.isLoading = true;
        this.loadingMessage = "Loading Model";
        this.cnnService.loadModelForTraining().subscribe(() => {
            this.loadingMessage = "Importing images";
            this.changeDetectorRef.detectChanges();
            this.addImages('Happy', this.happyImages).subscribe(() => {
                this.loadingMessage = `Number of emotions loaded: 1`;
                this.addImages('Angry', this.angryImages).subscribe(() => {
                    this.loadingMessage = `Number of emotions loaded: 2`;
                    this.addImages('Disgusted', this.disgustedImages).subscribe(() => {
                        this.loadingMessage = `Number of emotions loaded: 3`;
                        this.addImages('Afraid', this.afraidImages).subscribe(() => {
                            this.loadingMessage = `Number of emotions loaded: 4`;
                            this.addImages('Neutral', this.neutralImages).subscribe(() => {
                                this.loadingMessage = `Number of emotions loaded: 5`;
                                this.addImages('Sad', this.sadImages).subscribe(() => {
                                    this.loadingMessage = `Number of emotions loaded: 6`;
                                    this.addImages('Suprised', this.suprisedImages).subscribe(() => {
                                        this.loadingMessage = `Number of emotions loaded: 7`;
                                        this.startTraining().subscribe(() => {
                                            this.loadingMessage = `Training finished!`;
                                            this.isLoading = false;
                                            this.changeDetectorRef.detectChanges();
                                        });
                                    });
                                });
                            });
                        });
                    });
                });
            });
        });
    }


    startTraining(): Observable<void> {
        return new Observable<void>((obs) => {
            this.loadingMessage = "Training started";
            this.changeDetectorRef.detectChanges();
            this.cnnService.train((loss) => {
                if (loss == null) {
                    obs.next();
                } else {
                    this.loadingMessage = `Training started. Loss = ${loss}`;
                    console.log(loss);
                }
            });
        });

    }

    addImages(label: string, images: Array<string>): Observable<number> {
        return new Observable<number>((obs) => {
            if (images.length > 0) {
                let imagesLength = images.length;
                let totalImagesLoaded = 0;

                let addImageFunction = () => {
                    this.addImage(images[totalImagesLoaded], label).subscribe(() => {
                        totalImagesLoaded++;
                        if (totalImagesLoaded === imagesLength) {
                            obs.next();
                        } else {
                            this.loadingMessage = `(${label}) Number of images loaded: ${totalImagesLoaded}`
                            this.changeDetectorRef.detectChanges();
                            addImageFunction();
                        }
                    })
                };
                addImageFunction();


            } else {
                obs.next();
            }
        });

    }

    private addImage(image: string, label: string): Observable<void> {
        return new Observable<void>((obs) => {
            this.getImage(image).subscribe((imageElement) => {
                this.cnnService.addImage(imageElement, label).subscribe(() => {
                    obs.next();
                });
            });
        });
    }

    getImage(imageUrl: string): Observable<HTMLImageElement> {
        return new Observable<HTMLImageElement>((obs) => {
            let image = document.createElement('img');
            image.src = imageUrl;
            image.id = `${Math.random().toString(36).substring(2)}`
            image.onload = () => {
                obs.next(image);
            }
        });

    }

    predict(): void {
        /*let image = document.getElementById('cat');
        this.cnnService.predict(image).subscribe((results) => {
                console.log(results);
        });*/
    }
}
