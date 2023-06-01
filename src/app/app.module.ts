import { PotentialUpdatePageModule } from './../pages/potential-update/potential-update.module';
import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { AboutPage } from '../pages/about/about';
import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';
import { OtpPage } from '../pages/login-section/otp/otp';
import { RegistrationPage } from '../pages/login-section/registration/registration';
import { LoginScreenPage } from '../pages/login-section/login-screen/login-screen';

import { StatusBar } from '@ionic-native/status-bar';
import { PinchZoomModule } from 'ngx-pinch-zoom';
import { SplashScreen } from '@ionic-native/splash-screen';
import { CoupanCodePageModule } from '../pages/scane-pages/coupan-code/coupan-code.module';
import { ScanPageModule } from '../pages/scane-pages/scan/scan.module';
import { GiftDetailPageModule } from '../pages/gift-gallery/gift-detail/gift-detail.module';
import { GiftListPageModule } from '../pages/gift-gallery/gift-list/gift-list.module';
import { OffersPageModule } from '../pages/offers/offers.module';
import { CancelpolicyModalPageModule } from '../pages/cancelpolicy-modal/cancelpolicy-modal.module';
import { CancelationPolicyPageModule } from '../pages/cancelation-policy/cancelation-policy.module';
import { PointListPageModule } from '../pages/points/point-list/point-list.module';
import { PointDetailPageModule } from '../pages/points/point-detail/point-detail.module';
import { ProfilePageModule } from '../pages/profile/profile.module';
import { MainHomePageModule } from '../pages/main-home/main-home.module';
import { ProductsPageModule } from '../pages/products/products.module';
import { TermsPageModule } from '../pages/terms/terms.module';
import { AdvanceTextPageModule } from '../pages/advance-text/advance-text.module';
import { ProductDetailPageModule } from '../pages/product-detail/product-detail.module';
import { ProductSubdetailPageModule } from '../pages/product-subdetail/product-subdetail.module';
import { TransactionPageModule } from '../pages/transaction/transaction.module';
import { ShippingDetailPageModule } from '../pages/shipping-detail/shipping-detail.module';
import { NotificationPageModule } from '../pages/notification/notification.module';
import { ContactPageModule } from '../pages/contact/contact.module';
import { VideoPageModule } from '../pages/video/video.module';
import { NewsPageModule } from '../pages/news/news.module';
import { NewsDetailPageModule } from '../pages/news-detail/news-detail.module';
import { FeedbackPageModule } from '../pages/feedback/feedback.module';
import { AboutusModalPageModule } from '../pages/aboutus-modal/aboutus-modal.module';
import { DbserviceProvider } from '../providers/dbservice/dbservice';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { ConstantProvider } from '../providers/constant/constant';
import { HttpModule } from '@angular/http';
import { Camera } from '@ionic-native/camera';
import { OfferListPageModule } from '../pages/offer-list/offer-list.module';
import { IonicStorageModule } from '@ionic/storage';
import { SafePipe } from '../pipes/safe/safe';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { ViewProfilePageModule } from '../pages/view-profile/view-profile.module';
import { InAppBrowser } from '@ionic-native/in-app-browser'
import { DescriptionModelPageModule } from '../pages/description-model/description-model.module';
import { ReceiveRemarkModalPageModule } from '../pages/receive-remark-modal/receive-remark-modal.module';
import { AppVersion } from '@ionic-native/app-version';
import { TranslateModule, TranslateLoader} from '@ngx-translate/core';
import { TranslateHttpLoader} from '@ngx-translate/http-loader';
import { LanguagePage } from '../pages/language/language';
import { SocialSharing } from '@ionic-native/social-sharing';
import { DeviceOrientation } from '@ionic-native/device-orientation';
import { WorkingSitePageModule } from '../pages/working-site/working-site.module';
import { SitePopoverPage } from '../pages/site-popover/site-popover';
import { FurnitureIdeasPageModule } from '../pages/furniture-ideas/furniture-ideas.module';
import { FaqPageModule } from '../pages/faq/faq.module';
import { FaqAnswerPageModule } from '../pages/faq-answer/faq-answer.module';
import { FurnitureIdeasdetailPageModule } from '../pages/furniture-ideasdetail/furniture-ideasdetail.module';
import { FurnitureIdeassharePageModule } from '../pages/furniture-ideasshare/furniture-ideasshare.module';

import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';
import { MobileLoginPageModule } from '../pages/login-section/mobile-login/mobile-login.module';
import { ArrivalProductPageModule } from '../pages/arrival-product/arrival-product.module';
import { ArrivalDetailPageModule } from '../pages/arrival-detail/arrival-detail.module';
import { OfferProductPageModule } from '../pages/offer-product/offer-product.module';
import { OfferProductDetailPageModule } from '../pages/offer-product-detail/offer-product-detail.module';
import { FilterProductPageModule } from '../pages/filter-product/filter-product.module';
import { ContractorListPageModule } from '../pages/contractor/contractor-list/contractor-list.module';
import { ContractorAddPageModule } from '../pages/contractor/contractor-add/contractor-add.module';
import { ContractorDetailPageModule } from '../pages/contractor/contractor-detail/contractor-detail.module';
import { RegistrationPageModule } from '../pages/login-section/registration/registration.module';
import { RedeemTypePageModule } from '../pages/redeem-type/redeem-type.module';
import { SiteListPageModule } from '../pages/site/site-list/site-list.module';
import { SiteAddPageModule } from '../pages/site/site-add/site-add.module';
import { SiteDetailPageModule } from '../pages/site/site-detail/site-detail.module';
import { PurchaseAddPageModule } from '../pages/purchase/purchase-add/purchase-add.module';
import { PurchaseListPageModule } from '../pages/purchase/purchase-list/purchase-list.module';
import { PurchaseDetailPageModule } from '../pages/purchase/purchase-detail/purchase-detail.module';
import { IonicSelectableModule } from 'ionic-selectable';
import { StatusModalPageModule } from '../pages/status-modal/status-modal.module';
import { PcListPageModule } from '../pages/pc-list/pc-list.module';
import { DealerListPageModule } from '../pages/dealer-list/dealer-list.module';
import { UserAddPageModule } from '../pages/user-add/user-add.module';
import { UserDetailPageModule } from '../pages/user-detail/user-detail.module';
import { SupportPageModule } from '../pages/support/support.module';
import { SiteVisitAddPageModule } from '../pages/site-visit/site-visit-add/site-visit-add.module';
import { SiteVisitListPageModule } from '../pages/site-visit/site-visit-list/site-visit-list.module';
import { LocationAccuracy } from '@ionic-native/location-accuracy';
import { Geolocation } from '@ionic-native/geolocation';
import { SiteVisitDetailPageModule } from '../pages/site-visit/site-visit-detail/site-visit-detail.module';
import { VerifypcPageModule } from '../pages/verifypc/verifypc.module';
import { PointLocationPageModule } from '../pages/point-location/point-location.module';
import { Push } from '@ionic-native/push';
import { Market } from '@ionic-native/market';

export function createTranslateLoader(http: HttpClient) {
    return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
    declarations: [
        MyApp,
        AboutPage,
        HomePage,
        TabsPage,
        OtpPage,
        // RegistrationPage,
        LoginScreenPage,
        SafePipe,
        LanguagePage,
        SitePopoverPage
    ],
    imports: [
        BrowserModule,
        IonicModule.forRoot(MyApp),
        ScanPageModule,
        CoupanCodePageModule,
        GiftDetailPageModule,
        GiftListPageModule,
        RedeemTypePageModule,
        OffersPageModule,
        VerifypcPageModule,
        CancelpolicyModalPageModule,
        ViewProfilePageModule,
        CancelationPolicyPageModule,
        PointListPageModule,
        PointDetailPageModule,
        PotentialUpdatePageModule,        
        ProfilePageModule,
        MainHomePageModule,
        ProductsPageModule,
        TermsPageModule,
        AdvanceTextPageModule,
        ProductDetailPageModule,
        ProductSubdetailPageModule,
        TransactionPageModule,
        ShippingDetailPageModule,
        NotificationPageModule,
        ContactPageModule,
        VideoPageModule,
        NewsPageModule,
        PinchZoomModule,
        NewsDetailPageModule,
        FeedbackPageModule,
        HttpClientModule,
        HttpModule,
        AboutusModalPageModule,
        IonicStorageModule.forRoot(),
        OfferListPageModule,
        DescriptionModelPageModule,
        ReceiveRemarkModalPageModule,
        WorkingSitePageModule,
        FurnitureIdeasPageModule,
        FaqPageModule,
        FaqAnswerPageModule,
        MobileLoginPageModule,
        FurnitureIdeasdetailPageModule,
        FurnitureIdeassharePageModule,
        ArrivalProductPageModule,
        ArrivalDetailPageModule,
        OfferProductPageModule,
        OfferProductDetailPageModule,
        FilterProductPageModule,
        ContractorListPageModule,
        ContractorAddPageModule,
        RegistrationPageModule,
        SiteListPageModule,
        SiteAddPageModule,
        SiteDetailPageModule,
        PurchaseAddPageModule,
        PurchaseListPageModule,
        PurchaseDetailPageModule,
        PcListPageModule,
        DealerListPageModule,
        UserAddPageModule,
        UserDetailPageModule,
        SupportPageModule,
        ContractorDetailPageModule,
        StatusModalPageModule,
        SiteVisitAddPageModule,
        SiteVisitListPageModule,
        SiteVisitDetailPageModule,
        PointLocationPageModule,
        IonicSelectableModule,
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: createTranslateLoader,
                deps: [HttpClient]
            }
        })
        
    ],
    bootstrap: [IonicApp],
    entryComponents: [
        MyApp,
        AboutPage,
        HomePage,
        TabsPage,
        OtpPage,
        // RegistrationPage,
        LoginScreenPage,
        LanguagePage,
        SitePopoverPage
    ],
    providers: [
        StatusBar,
        DbserviceProvider,
        SplashScreen,
        ConstantProvider,
        Camera,
        BarcodeScanner,
        FileTransfer,
        Push,
        Market,
        InAppBrowser,
        DeviceOrientation,
        AppVersion,
        SocialSharing,
        FileTransferObject,
        Geolocation,
        LocationAccuracy,
        File,
        {provide: ErrorHandler, useClass: IonicErrorHandler}
    ]
})
export class AppModule {}
