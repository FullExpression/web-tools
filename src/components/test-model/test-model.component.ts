import { Component, ChangeDetectorRef } from '@angular/core';
import { CNNService } from '@fullexpression/emotionclassification';
import { Observable } from 'rxjs';
import { EmotionService } from '@fullexpression/emotionclassification';
import { ConfusionMatrix } from '@fullexpression/confusionmatrix';
import { PredictionResults } from '@fullexpression/emotionclassification';
import { CnnEnum } from '@fullexpression/emotionclassification';

@Component({
    selector: 'test--model',
    templateUrl: './test-model.component.html',
    styleUrls: ['./test-model.component.scss']
})
export class TestModelComponent {
    private afraidImages = new Array<string>();
    private angryImages = new Array<string>();
    private disgustedImages = new Array<string>();
    private happyImages = new Array<string>();
    private neutralImages = new Array<string>();
    private sadImages = new Array<string>();
    private suprisedImages = new Array<string>();
    private loadingMessage = "";
    isLoading = false;
    testMode = false;
    cnnSelectOption = "";
    private accuracies = {
        Afraid: 0,
        Angry: 0,
        Disgusted: 0,
        Happy: 0,
        Neutral: 0,
        Sad: 0,
        Suprised: 0
    }
    private truePositives = {
        Afraid: 0,
        Angry: 0,
        Disgusted: 0,
        Happy: 0,
        Neutral: 0,
        Sad: 0,
        Suprised: 0
    }
    private trueNegatives = {
        Afraid: 0,
        Angry: 0,
        Disgusted: 0,
        Happy: 0,
        Neutral: 0,
        Sad: 0,
        Suprised: 0
    }
    private falsePositives = {
        Afraid: 0,
        Angry: 0,
        Disgusted: 0,
        Happy: 0,
        Neutral: 0,
        Sad: 0,
        Suprised: 0
    }
    private falseNegatives = {
        Afraid: 0,
        Angry: 0,
        Disgusted: 0,
        Happy: 0,
        Neutral: 0,
        Sad: 0,
        Suprised: 0
    }
    private precision = {
        Afraid: 0,
        Angry: 0,
        Disgusted: 0,
        Happy: 0,
        Neutral: 0,
        Sad: 0,
        Suprised: 0
    }
    private recall = {
        Afraid: 0,
        Angry: 0,
        Disgusted: 0,
        Happy: 0,
        Neutral: 0,
        Sad: 0,
        Suprised: 0
    }
    private f1Score = {
        Afraid: 0,
        Angry: 0,
        Disgusted: 0,
        Happy: 0,
        Neutral: 0,
        Sad: 0,
        Suprised: 0
    }
    private totalAccuracy = 0;
    private totalPrecision = 0;
    private totalRecall = 0;
    private totalF1Score = 0;
    private confusionMatrix: ConfusionMatrix = {
        labels: ["afraid", "angry", "disgusted", "happy", "neutral", "sad", "suprised"],
        matrix: [
            [7, 2, 3, 4, 5, 20, 1],
            [1, 7, 3, 4, 5, 6, 2],
            [1, 2, 7, 2, 5, 6, 3],
            [1, 2, 3, 100, 5, 6, 4],
            [1, 2, 90, 4, 7, 6, 5],
            [1, 80, 3, 4, 5, 7, 6],
            [1, 2, 3, 70, 60, 50, 7]
        ]
    }
    private cnnsEnum = CnnEnum;
    constructor(private cnnService: CNNService,
        private emotionService: EmotionService,
        private changeDetectorRef: ChangeDetectorRef) { }

    testAgain(): void {
        this.testMode = false;
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

    startTesting(): void {
        this.testMode = true;
        this.isLoading = true;
        this.loadingMessage = "Loading Model";
        this.emotionService.initialize().subscribe(() => {
            this.startClassifyingImages();
        });
    }

    startClassifyingImages(): void {
        this.loadingMessage = "Classifying emotions";
        this.confusionMatrix.matrix = new Array<Array<number>>();
        this.getEmotions("Afraid", this.afraidImages).subscribe((afraidResult) => {
            this.confusionMatrix.matrix.push(afraidResult.toArray());
            this.getEmotions("Angry", this.angryImages).subscribe((angryResult) => {
                this.confusionMatrix.matrix.push(angryResult.toArray());
                this.getEmotions("Disgusted", this.disgustedImages).subscribe((disgustedResult) => {
                    this.confusionMatrix.matrix.push(disgustedResult.toArray());
                    this.getEmotions("Happy", this.happyImages).subscribe((happyResult) => {
                        this.confusionMatrix.matrix.push(happyResult.toArray());
                        this.getEmotions("Neutral", this.neutralImages).subscribe((neutralResult) => {
                            this.confusionMatrix.matrix.push(neutralResult.toArray());
                            this.getEmotions("Sad", this.sadImages).subscribe((sadResult) => {
                                this.confusionMatrix.matrix.push(sadResult.toArray());
                                this.getEmotions("Suprised", this.suprisedImages).subscribe((supriseResult) => {
                                    this.confusionMatrix.matrix.push(supriseResult.toArray());
                                    this.calculateMetrics();
                                    this.isLoading = false;
                                });
                            });
                        });
                    });
                });
            });
        });
    }

    getEmotions(label: string, images: Array<string>): Observable<PredictionResults> {
        return new Observable<PredictionResults>((obs) => {
            let predictionResults = new PredictionResults(label);

            if (images.length > 0) {
                let imagesLength = images.length;
                let totalImagesLoaded = 0;


                let getNewEmotion = () => {
                    this.emotionService.getEmotion(images[totalImagesLoaded]).subscribe((cnnClassification) => {
                        predictionResults.addPrediction(cnnClassification.classificationLabel);
                        totalImagesLoaded++;
                        if (totalImagesLoaded === imagesLength) {
                            obs.next(predictionResults);
                        } else {
                            this.loadingMessage = `(${label}) Number of classified emotions: ${totalImagesLoaded}`
                            this.changeDetectorRef.detectChanges();
                            getNewEmotion();
                        }
                    });
                };
                getNewEmotion();
            } else {
                obs.next(predictionResults);
            }
        });
    }
    private calculateMetrics(): void {
        let totalAfraid = this.confusionMatrix.matrix[0].reduce((a, b) => a + b, 0);
        let totalAngry = this.confusionMatrix.matrix[1].reduce((a, b) => a + b, 0);
        let totalDisgusted = this.confusionMatrix.matrix[2].reduce((a, b) => a + b, 0);
        let totalHappy = this.confusionMatrix.matrix[3].reduce((a, b) => a + b, 0);
        let totalNeutral = this.confusionMatrix.matrix[4].reduce((a, b) => a + b, 0);
        let totalSad = this.confusionMatrix.matrix[5].reduce((a, b) => a + b, 0);
        let totalSuprised = this.confusionMatrix.matrix[6].reduce((a, b) => a + b, 0);

        this.accuracies.Afraid = this.confusionMatrix.matrix[0][0] / totalAfraid * 100;
        this.accuracies.Angry = this.confusionMatrix.matrix[1][1] / totalAngry * 100;
        this.accuracies.Disgusted = this.confusionMatrix.matrix[2][2] / totalDisgusted * 100;
        this.accuracies.Happy = this.confusionMatrix.matrix[3][3] / totalHappy * 100;
        this.accuracies.Neutral = this.confusionMatrix.matrix[4][4] / totalNeutral * 100;
        this.accuracies.Sad = this.confusionMatrix.matrix[5][5] / totalSad * 100;
        this.accuracies.Suprised = this.confusionMatrix.matrix[6][6] / totalSuprised * 100;

        this.falseNegatives.Afraid = this.confusionMatrix.matrix[0].reduce((a, b) => a + b) - this.confusionMatrix.matrix[0][0];
        this.falseNegatives.Angry = this.confusionMatrix.matrix[1].reduce((a, b) => a + b) - this.confusionMatrix.matrix[1][1];
        this.falseNegatives.Disgusted = this.confusionMatrix.matrix[2].reduce((a, b) => a + b) - this.confusionMatrix.matrix[2][2];
        this.falseNegatives.Happy = this.confusionMatrix.matrix[3].reduce((a, b) => a + b) - this.confusionMatrix.matrix[3][3];
        this.falseNegatives.Neutral = this.confusionMatrix.matrix[4].reduce((a, b) => a + b) - this.confusionMatrix.matrix[4][4];
        this.falseNegatives.Sad = this.confusionMatrix.matrix[5].reduce((a, b) => a + b) - this.confusionMatrix.matrix[5][5];
        this.falseNegatives.Suprised = this.confusionMatrix.matrix[6].reduce((a, b) => a + b) - this.confusionMatrix.matrix[6][6];

        let trasponsedMatrix = this.transposeMatrix(this.confusionMatrix.matrix);

        this.falsePositives.Afraid = trasponsedMatrix[0].reduce((a, b) => a + b) - trasponsedMatrix[0][0];
        this.falsePositives.Angry = trasponsedMatrix[1].reduce((a, b) => a + b) - trasponsedMatrix[1][1];
        this.falsePositives.Disgusted = trasponsedMatrix[2].reduce((a, b) => a + b) - trasponsedMatrix[2][2];
        this.falsePositives.Happy = trasponsedMatrix[3].reduce((a, b) => a + b) - trasponsedMatrix[3][3];
        this.falsePositives.Neutral = trasponsedMatrix[4].reduce((a, b) => a + b) - trasponsedMatrix[4][4];
        this.falsePositives.Sad = trasponsedMatrix[5].reduce((a, b) => a + b) - trasponsedMatrix[5][5];
        this.falsePositives.Suprised = trasponsedMatrix[6].reduce((a, b) => a + b) - trasponsedMatrix[6][6];

        this.accuracies.Afraid = this.accuracies.Afraid ? this.accuracies.Afraid : 0;
        this.accuracies.Angry = this.accuracies.Angry ? this.accuracies.Angry : 0;
        this.accuracies.Disgusted = this.accuracies.Disgusted ? this.accuracies.Disgusted : 0;
        this.accuracies.Happy = this.accuracies.Happy ? this.accuracies.Happy : 0;
        this.accuracies.Neutral = this.accuracies.Neutral ? this.accuracies.Neutral : 0;
        this.accuracies.Sad = this.accuracies.Sad ? this.accuracies.Sad : 0;
        this.accuracies.Suprised = this.accuracies.Suprised ? this.accuracies.Suprised : 0;

        this.precision.Afraid = trasponsedMatrix[0][0] / (trasponsedMatrix[0].reduce((a, b) => a + b));
        this.precision.Angry = trasponsedMatrix[1][1] / (trasponsedMatrix[1].reduce((a, b) => a + b));
        this.precision.Disgusted = trasponsedMatrix[2][2] / (trasponsedMatrix[2].reduce((a, b) => a + b));
        this.precision.Happy = trasponsedMatrix[3][3] / (trasponsedMatrix[3].reduce((a, b) => a + b));
        this.precision.Neutral = trasponsedMatrix[4][4] / (trasponsedMatrix[4].reduce((a, b) => a + b));
        this.precision.Sad = trasponsedMatrix[5][5] / (trasponsedMatrix[5].reduce((a, b) => a + b));
        this.precision.Suprised = trasponsedMatrix[6][6] / (trasponsedMatrix[6].reduce((a, b) => a + b));

        this.precision.Afraid = this.precision.Afraid ? this.precision.Afraid : 0;
        this.precision.Angry = this.precision.Angry ? this.precision.Angry : 0;
        this.precision.Disgusted = this.precision.Disgusted ? this.precision.Disgusted : 0;
        this.precision.Happy = this.precision.Happy ? this.precision.Happy : 0;
        this.precision.Neutral = this.precision.Neutral ? this.precision.Neutral : 0;
        this.precision.Sad = this.precision.Sad ? this.precision.Sad : 0;
        this.precision.Suprised = this.precision.Suprised ? this.precision.Suprised : 0;

        this.recall.Afraid = this.confusionMatrix.matrix[0][0] / (this.confusionMatrix.matrix[0].reduce((a, b) => a + b));
        this.recall.Angry = this.confusionMatrix.matrix[1][1] / (this.confusionMatrix.matrix[1].reduce((a, b) => a + b));
        this.recall.Disgusted = this.confusionMatrix.matrix[2][2] / (this.confusionMatrix.matrix[2].reduce((a, b) => a + b));
        this.recall.Happy = this.confusionMatrix.matrix[3][3] / (this.confusionMatrix.matrix[3].reduce((a, b) => a + b));
        this.recall.Neutral = this.confusionMatrix.matrix[4][4] / (this.confusionMatrix.matrix[4].reduce((a, b) => a + b));
        this.recall.Sad = this.confusionMatrix.matrix[5][5] / (this.confusionMatrix.matrix[5].reduce((a, b) => a + b));
        this.recall.Suprised = this.confusionMatrix.matrix[6][6] / (this.confusionMatrix.matrix[6].reduce((a, b) => a + b));

        this.recall.Afraid = this.recall.Afraid ? this.recall.Afraid : 0;
        this.recall.Angry = this.recall.Angry ? this.recall.Angry : 0;
        this.recall.Disgusted = this.recall.Disgusted ? this.recall.Disgusted : 0;
        this.recall.Happy = this.recall.Happy ? this.recall.Happy : 0;
        this.recall.Neutral = this.recall.Neutral ? this.recall.Neutral : 0;
        this.recall.Sad = this.recall.Sad ? this.recall.Sad : 0;
        this.recall.Suprised = this.recall.Suprised ? this.recall.Suprised : 0;

        this.f1Score.Afraid = 2 * ((this.precision.Afraid * this.recall.Afraid) / (this.precision.Afraid + this.recall.Afraid));
        this.f1Score.Angry = 2 * ((this.precision.Angry * this.recall.Angry) / (this.precision.Angry + this.recall.Angry));
        this.f1Score.Disgusted = 2 * ((this.precision.Disgusted * this.recall.Disgusted) / (this.precision.Disgusted + this.recall.Disgusted));
        this.f1Score.Happy = 2 * ((this.precision.Happy * this.recall.Happy) / (this.precision.Happy + this.recall.Happy));
        this.f1Score.Neutral = 2 * ((this.precision.Neutral * this.recall.Neutral) / (this.precision.Neutral + this.recall.Neutral));
        this.f1Score.Sad = 2 * ((this.precision.Sad * this.recall.Sad) / (this.precision.Sad + this.recall.Sad));
        this.f1Score.Suprised = 2 * ((this.precision.Suprised * this.recall.Suprised) / (this.precision.Suprised + this.recall.Suprised));

        this.f1Score.Afraid = this.f1Score.Afraid ? this.f1Score.Afraid : 0;
        this.f1Score.Angry = this.f1Score.Angry ? this.f1Score.Angry : 0;
        this.f1Score.Disgusted = this.f1Score.Disgusted ? this.f1Score.Disgusted : 0;
        this.f1Score.Happy = this.f1Score.Happy ? this.f1Score.Happy : 0;
        this.f1Score.Neutral = this.f1Score.Neutral ? this.f1Score.Neutral : 0;
        this.f1Score.Sad = this.f1Score.Sad ? this.f1Score.Sad : 0;
        this.f1Score.Suprised = this.f1Score.Suprised ? this.f1Score.Suprised : 0;


        this.totalAccuracy = (this.accuracies.Afraid + this.accuracies.Angry + this.accuracies.Disgusted +
            this.accuracies.Happy + this.accuracies.Neutral + this.accuracies.Sad + this.accuracies.Suprised) / 7;
        this.totalPrecision = (this.precision.Afraid + this.precision.Angry + this.precision.Disgusted +
            this.precision.Happy + this.precision.Neutral + this.precision.Sad + this.precision.Suprised) / 7;
        this.totalRecall = (this.recall.Afraid + this.recall.Angry + this.recall.Disgusted +
            this.recall.Happy + this.recall.Neutral + this.recall.Sad + this.recall.Suprised) / 7;
        this.totalF1Score = (this.f1Score.Afraid + this.f1Score.Angry + this.f1Score.Disgusted +
            this.f1Score.Happy + this.f1Score.Neutral + this.f1Score.Sad + this.f1Score.Suprised) / 7;

    }

    private transposeMatrix(matrix: Array<Array<number>>): Array<Array<number>> {
        return Object.keys(matrix[0]).map(function (c) {
            return matrix.map(function (r) { return r[c]; });
        });
    }
}
