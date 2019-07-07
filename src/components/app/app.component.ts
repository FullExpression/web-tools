import { Component } from '@angular/core';
import { NvarModel } from '@fullexpression/core';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {
    nvarBarElements: NvarModel = {
        routeLinks: [
            { name: "Normalize Images", link: '/normalize-images' },
            { name: "Train Model", link: '/train' },
            { name: "Test Model", link: '/test-model' },
            { name: "Data Augmentation", link: '/data-augmentation' }
        ]
    }
    ngOnInit() { }
}
