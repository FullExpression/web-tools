import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar'
import { MatCheckboxModule } from '@angular/material/checkbox'
@NgModule({
    imports: [MatButtonModule,
        MatProgressSpinnerModule, MatProgressBarModule, MatInputModule,
        MatCheckboxModule],
    exports: [MatButtonModule,
        MatProgressSpinnerModule, MatProgressBarModule, MatInputModule,
        MatCheckboxModule],
})
export class MaterialModule { }