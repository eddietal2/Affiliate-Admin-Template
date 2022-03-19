import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RatingsStarsComponent } from './ratings-stars/ratings-stars.component';


@NgModule({
    imports: [
        CommonModule,
        IonicModule.forRoot()
     ],
    declarations: [
        RatingsStarsComponent
    ],
    exports: [
        RatingsStarsComponent
    ]
})
export class CustomComponentsModule {}
