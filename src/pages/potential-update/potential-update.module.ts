import { HttpClient } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { IonicPageModule } from 'ionic-angular';
import { createTranslateLoader } from '../offers/offers.module';
import { PotentialUpdatePage } from './potential-update';

@NgModule({
  declarations: [
    PotentialUpdatePage,
  ],
  imports: [
    IonicPageModule.forChild(PotentialUpdatePage),
    TranslateModule.forRoot({
      loader: {
          provide: TranslateLoader,
          useFactory: createTranslateLoader,
          deps: [HttpClient]
      }
  })
  ],
})
export class PotentialUpdatePageModule {}
