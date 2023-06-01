import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SiteVisitAddPage } from './site-visit-add';

import { TranslateHttpLoader} from '@ngx-translate/http-loader';
import { HttpClient } from '@angular/common/http';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { IonicSelectableModule } from 'ionic-selectable';

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    SiteVisitAddPage,
  ],
  imports: [
    IonicPageModule.forChild(SiteVisitAddPage),
    IonicSelectableModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient]
      }
    })
    
  ],
})
export class SiteVisitAddPageModule {}
