import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SiteAddPage } from './site-add';
import { TranslateHttpLoader} from '@ngx-translate/http-loader';
import { HttpClient } from '@angular/common/http';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { IonicSelectableModule } from 'ionic-selectable';

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}



@NgModule({
  declarations: [
    SiteAddPage,
  ],
  imports: [
    IonicPageModule.forChild(SiteAddPage),
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
export class SiteAddPageModule {}
