import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SiteVisitListPage } from './site-visit-list';
import { TranslateHttpLoader} from '@ngx-translate/http-loader';
import { HttpClient } from '@angular/common/http';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    SiteVisitListPage,
  ],
  imports: [
    IonicPageModule.forChild(SiteVisitListPage),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient]
      }
    })
  ],
})
export class SiteVisitListPageModule {}
