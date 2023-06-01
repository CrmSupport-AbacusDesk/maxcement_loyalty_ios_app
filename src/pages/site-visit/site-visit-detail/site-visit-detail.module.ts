import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SiteVisitDetailPage } from './site-visit-detail';

import { TranslateHttpLoader} from '@ngx-translate/http-loader';
import { HttpClient } from '@angular/common/http';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    SiteVisitDetailPage,
  ],
  imports: [
    IonicPageModule.forChild(SiteVisitDetailPage),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient]
      }
    })
  ],
})
export class SiteVisitDetailPageModule {}
