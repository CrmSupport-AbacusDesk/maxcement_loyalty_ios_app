import { Component } from '@angular/core';
import { NavController, Loading, LoadingController, AlertController, ModalController,Platform, NavParams } from 'ionic-angular';
import { ScanPage } from '../scane-pages/scan/scan';
import { OfferListPage } from '../offer-list/offer-list';
import { PointListPage } from '../points/point-list/point-list';
import { DbserviceProvider } from '../../providers/dbservice/dbservice';
import { OffersPage } from '../offers/offers';
import { Storage } from '@ionic/storage';
import { BarcodeScanner, BarcodeScannerOptions } from '@ionic-native/barcode-scanner';
import { GiftListPage } from '../gift-gallery/gift-list/gift-list';
import { ViewProfilePage } from '../view-profile/view-profile';
import { Push, PushObject, PushOptions } from '@ionic-native/push';
import { CoupanCodePage } from '../scane-pages/coupan-code/coupan-code';
import { ProfilePage } from '../profile/profile';
import { TermsPage } from '../terms/terms';
import { AboutusModalPage } from '../aboutus-modal/aboutus-modal';
import * as jwt_decode from "jwt-decode";
import { TranslateService } from '@ngx-translate/core';
import { ConstantProvider } from '../../providers/constant/constant';
// import { AboutPage } from '../about/about';
import { FurnitureIdeasPage } from '../furniture-ideas/furniture-ideas';
import { ProductsPage } from '../products/products';
import { WorkingSitePage } from '../working-site/working-site';
import { FeedbackPage } from '../feedback/feedback';
import { NewsPage } from '../news/news';
import { VideoPage } from '../video/video';
import { ContactPage } from '../contact/contact';
import { FaqPage } from '../faq/faq';
import { TransactionPage } from '../transaction/transaction';
import { AdvanceTextPage } from '../advance-text/advance-text';
import { SocialSharing } from '@ionic-native/social-sharing';
import { NotificationPage } from '../notification/notification';
import { LanguagePage } from '../language/language';
import { ArrivalProductPage } from '../arrival-product/arrival-product';
import { OfferProductPage } from '../offer-product/offer-product';
import { ContractorListPage } from '../contractor/contractor-list/contractor-list';
import { RedeemTypePage } from '../redeem-type/redeem-type';
import { SiteAddPage } from '../site/site-add/site-add';
import { SiteListPage } from '../site/site-list/site-list';
import { ProductDetailPage } from '../product-detail/product-detail';
import { PurchaseListPage } from '../purchase/purchase-list/purchase-list';
import { PcListPage } from '../pc-list/pc-list';
import { DealerListPage } from '../dealer-list/dealer-list';
import { SupportPage } from '../support/support';
import { SiteVisitListPage } from '../site-visit/site-visit-list/site-visit-list';
import { AppVersion } from '@ionic-native/app-version';
@Component({
    selector: 'page-home',
    templateUrl: 'home.html'
})
export class HomePage {
    
    offer_list:any=[];
    loading:Loading;
    karigar_detail:any={};
    last_point:any='';
    today_point:any='';
    appbanner:any={};
    qr_code:any='';
    coupon_value:any='';
    uploadUrl:any='';
    bannerURL:string='';
    tokenInfo:any = {};
    lang:any="";
    active:boolean = false;
    offer_detail:any={};
    language:any=[];
    testRadioOpen:any='';
    testRadioResult:any='';
    value:string='';
    notifications:any='';
    user_type:any='';
    idlogin:any='';
    registration:any='';
    sitePending:any ={};
    purPending:any ={};
    version: any;
    bahubali: any;
    engineer: any;

    constructor(public platform:Platform,public navCtrl: NavController,public navParams: NavParams,public app_version:AppVersion,public service:DbserviceProvider,public loadingCtrl:LoadingController,public storage:Storage, private barcodeScanner: BarcodeScanner,public alertCtrl:AlertController,public modalCtrl: ModalController,private push: Push,public translate:TranslateService,public constant:ConstantProvider,public socialSharing:SocialSharing) {
        console.log(this.service);
       
        console.log(this.version);
        
        this.presentLoading();
        this.notification();
    }
    ionViewWillEnter()
    {
        this.uploadUrl = this.constant.upload_url;
        this.bannerURL = this.constant.upload_url;
        console.log('ionViewDidLoad HomePage',this.bannerURL);
        this.translate.setDefaultLang(this.lang);
        this.translate.use(this.lang);
        this.getData();
        this.get_user_lang();
        this.getofferBannerList();

    }
    
    doRefresh(refresher) 
    {
        console.log('Begin async operation', refresher);
        this.getData(); 
        refresher.complete();
    }
    
   

    logout(){
        this.storage.set('token','');
        this.service.karigar_info='';
        this.platform.exitApp();
    }
    
    total_balance_point:any;
    sharepoint:any=0;
    notify_cn=0;
    getData()
    {
        console.log("Check");
        this.service.post_rqst({'karigar_id':this.service.karigar_id},'app_karigar/karigarHome')
        .subscribe((r:any)=>
        {
            console.log(r);
            this.loading.dismiss();
            this.language=r['language'];
            this.karigar_detail=r['karigar'];
            this.appbanner=r['appbanner'];
            this.sitePending=r.site_pending;
            this.purPending=r.purchase_order_pending;


            console.log(this.sitePending);
            if(this.karigar_detail.user_type == 3){
                this.karigar_potential_alert();
            }
            console.log(this.karigar_detail.status);
            if(this.karigar_detail.user_type ==3 && this.karigar_detail.is_active == 'Deactive' ){
                this.logout();
            }
            // if(this.karigar_detail.user_type!=3){
                
                this.offer_detail=r['offer'];
                this.last_point=r['last_point'];
                this.notify_cn=r['notifications'];
                this.today_point=r['today_point'];
                
                this.total_balance_point = parseInt( this.karigar_detail.balance_point) + parseInt(this.karigar_detail.referal_point_balance );
                console.log(this.total_balance_point);
                
                this.sharepoint=r['points']['owner_ref_point'];
                
            // }
        });

    }
    
    
    getofferBannerList()
    {
        console.log(this.service.karigar_id);
        console.log('offerbanner');
        this.service.post_rqst({'karigar_id':this.service.karigar_id},'app_karigar/offerList')
        .subscribe((r)=>
        {
            console.log(r);
            this.offer_list=r['offer'];
            console.log(this.offer_list);
        });
    } 
    
    
    
    
    
    qr_count:any=0;
    qr_limit:any=0;
    scanCoupon() {
        let alert = this.alertCtrl.create();
        alert.setTitle('Coupon');
        
        alert.addInput({
            type: 'radio',
            label: 'Coupon Scan',
            value: 'scan',
            checked: true
        });
        alert.addInput({
            type: 'radio',
            label: 'Enter Coupon Code',
            value: 'code',
            
        });
        
        alert.addButton('Cancel');
        alert.addButton({
            text: 'OK',
            handler: data => {
                this.testRadioOpen = false;
                // this.testRadioResult = data;
                this.value = data;
                console.log("redio val =====>",this.value)
                if(this.value == 'scan'){
                    this.scan();
                }else if(this.value == 'code'){
                    this.navCtrl.push(CoupanCodePage)
                }
                
            }
        });
        alert.present();
    }
    scan()
    {
        if( this.karigar_detail.manual_permission==1)
        {
            this.navCtrl.push(CoupanCodePage)
        }
        else
        {
            this.service.post_rqst({'karigar_id':this.service.karigar_id},"app_karigar/get_qr_permission")
            .subscribe(resp=>{
                console.log(resp);
                this.qr_count = resp['karigar_daily_count'];
                this.qr_limit = resp['qr_limit'];
                console.log(this.qr_count);
                console.log(this.qr_limit);
                
                if(parseInt(this.qr_count) <= parseInt(this.qr_limit) )
                {
                    const options:BarcodeScannerOptions =  { 
                        // prompt : "लैमिनेट शीट के स्टीकर को स्कैन करते समय, लाल रंग की लाइन को बारकोड स्टीकर की सभी लाइनों पर डालें स्कैन न होने पर संपर्क करें। कॉल करें- +91-9773897370"
                        prompt : ""
                    };
                    this.barcodeScanner.scan(options).then(resp => {
                        console.log(resp);
                        this.qr_code=resp.text;
                        console.log( this.qr_code);
                        if(resp.text != '')
                        {
                            this.service.post_rqst({'karigar_id':this.service.karigar_id,'qr_code':this.qr_code},'app_karigar/karigarCoupon')
                            .subscribe((r:any)=>
                            {
                                console.log(r);
                                
                                if(r['status'] == 'INVALID'){
                                    this.translate.get("Invalid Coupon Code")
                                    .subscribe(resp=>{
                                        this.showAlert(resp);
                                    })
                                    return;
                                }
                                else if(r['status'] == 'USED'){
                                    this.translate.get("Coupon Already Used")
                                    .subscribe(resp=>{
                                        this.showAlert(resp);
                                    })
                                    return;
                                }
                                else if(r['status'] == 'UNASSIGNED OFFER'){
                                    this.translate.get("Your Account Under Verification")
                                    .subscribe(resp=>{
                                        this.showAlert(resp);
                                    })
                                    return;
                                }
                                this.translate.get("points has been added into your wallet")
                                .subscribe(resp=>{
                                    this.showSuccess( r['coupon_value'] +resp)
                                })
                                this.getData();
                            });
                        }
                        else{
                            console.log('not scanned anything');
                        }
                    });
                }
                else
                {
                    this.translate.get("You have exceed the daily QR scan limit")
                    .subscribe(resp=>{
                        this.showAlert(resp);
                    })
                }
            })
        }
    }
    
    
    viewProfiePic()
    {
        this.modalCtrl.create(ViewProfilePage, {"Image": this.karigar_detail.profile,type:"base_64"}).present();
    }
    
    viewProfie()
    {
        console.log(this.lang);
        
        this.navCtrl.push(ProfilePage,{'lang':this.lang})
    }
    
    goOnScanePage(){
        this.navCtrl.push(ScanPage);
    }
    
    goOnOffersListPage(){
        
        if(this.user_type != 3){
            if(this.karigar_detail.status !='Verified'){
                let alert = this.alertCtrl.create({
                    title:'Sorry!',
                    cssClass:'action-close',
                    subTitle:"Your current profile status is not Verified",
                    buttons: [
                        {
                            text: 'Okay',
                            handler: () => {
                            }
                        }
                    ]
                });
                alert.present();  
                return
            }
        }
        
        
        
        this.navCtrl.push(OfferListPage);
        
    }
    goOnOffersPage(id)
    {
        this.navCtrl.push(OffersPage,{'id':id});
    }
    
    goOnPointeListPage(){
        this.navCtrl.push(PointListPage);
        
    }
    goOnWorkingSitePage()
    {
        this.navCtrl.push(WorkingSitePage);
    }

    
    goOntermsPage(id){
        this.navCtrl.push(TermsPage, {'id':id});
    }
    
    goOnFeedbackPage()
    {
        this.navCtrl.push(FeedbackPage);
    }
    presentLoading() 
    {
        this.loading = this.loadingCtrl.create({
            content: "Please wait...",
            dismissOnPageChange: false
        });
        this.loading.present();
    }
    goOnGiftListPage()
    {
        if(this.karigar_detail.status !='Verified'){
            let alert = this.alertCtrl.create({
                title:'Sorry!',
                cssClass:'action-close',
                subTitle:"Your current profile status is not Verified",
                buttons: [
                    {
                        text: 'Okay',
                        handler: () => {
                        }
                    }
                ]
            });
            alert.present();  
            return
        }
        this.navCtrl.push(RedeemTypePage,{'mode':'home',"balence_point":this.total_balance_point});
    }
    
    goOnFurniturePage()
    {
        this.navCtrl.push(FurnitureIdeasPage);
    }
    goOnProductsPage()
    {
        this.navCtrl.push(ProductDetailPage);
        // this.navCtrl.push(ProductsPage);
        
        
    }
    goTOPurchase(){
        if(this.karigar_detail.user_type != 3){
            if(this.karigar_detail.status !='Verified'){
                let alert = this.alertCtrl.create({
                    title:'Sorry!',
                    cssClass:'action-close',
                    subTitle:"Your current profile status is not Verified",
                    buttons: [
                        {
                            text: 'Okay',
                            handler: () => {
                            }
                        }
                    ]
                });
                alert.present();  
                return
            }
        }
        
        
        console.log(this.karigar_detail.user_type);
        
        this.navCtrl.push(PurchaseListPage, {"user_type":this.karigar_detail.user_type, "team_exist":this.karigar_detail.team_exist})
    }
    goOnArrivalProductsPage(){
        if(this.karigar_detail.user_type != 3){
            if(this.karigar_detail.status !='Verified'){
                let alert = this.alertCtrl.create({
                    title:'Sorry!',
                    cssClass:'action-close',
                    subTitle:"Your current profile status is not Verified",
                    buttons: [
                        {
                            text: 'Okay',
                            handler: () => {
                            }
                        }
                    ]
                });
                alert.present();  
                return
            }
        }
        
        this.navCtrl.push(ArrivalProductPage);
    }
    goOnOfferProductsPage(){
        this.navCtrl.push(OfferProductPage);
    }
    goOnContractorPage(){
        this.navCtrl.push(ContractorListPage);
    }
    viewDetail()
    {
        this.modalCtrl.create(ViewProfilePage, {"Image": this.lang !='en' ? this.offer_detail.hin_term_image : this.offer_detail.term_image}).present();
    }
    gotoHistory()
    {
        if(this.karigar_detail.user_type != 3){
            if(this.karigar_detail.status !='Verified'){
                let alert = this.alertCtrl.create({
                    title:'Sorry!',
                    cssClass:'action-close',
                    subTitle:"Your current profile status is not Verified",
                    buttons: [
                        {
                            text: 'Okay',
                            handler: () => {
                            }
                        }
                    ]
                });
                alert.present();  
                return
            }
        }
        this.navCtrl.push(TransactionPage)
    }
    goOnGiftGallary()
    {
        if(this.karigar_detail.user_type != 3){
            if(this.karigar_detail.status !='Verified'){
                let alert = this.alertCtrl.create({
                    title:'Sorry!',
                    cssClass:'action-close',
                    subTitle:"Your current profile status is not Verified",
                    buttons: [
                        {
                            text: 'Okay',
                            handler: () => {
                            }
                        }
                    ]
                });
                alert.present();  
                return
            }
        }
        this.navCtrl.push(GiftListPage)
    }
    goOnNewsPage()
    {
        this.navCtrl.push(NewsPage);
    }
    goOnVideoPage()
    {
        this.navCtrl.push(VideoPage);
    }
    goOnContactPage()
    {
        this.navCtrl.push(ContactPage);
    }
    goOnfaqPage()
    {
        this.navCtrl.push(FaqPage);
    }
    goOnAdvanceTextPage()
    {
        this.navCtrl.push(AdvanceTextPage);
    }
    gotoNotification()
    {
        this.navCtrl.push(NotificationPage);
    }
    goOnPcListPage(user_type){
        this.navCtrl.push(PcListPage,{"user_type":this.karigar_detail.user_type, "userFilter":user_type, "approval_right":this.karigar_detail.approval_right})
    }
    goOnSupportPage()
    {
        this.navCtrl.push(SupportPage);
    }
    goOnDealerListPage(){
        this.navCtrl.push(DealerListPage, {'zone':this.karigar_detail.assigned_location})
    }
    gotoChangeLang()
    {
        this.navCtrl.push(LanguagePage,{"come_from":"homepage"});
    }
    gotoSiteVisit()
    {
        this.navCtrl.push(SiteVisitListPage, {"user_type":this.karigar_detail.user_type, "team_exist":this.karigar_detail.team_exist});
    }
    
    goTOSite(){
        
        if(this.karigar_detail.user_type  != 3){
            if(this.karigar_detail.status !='Verified'){
                let alert = this.alertCtrl.create({
                    title:'Sorry!',
                    cssClass:'action-close',
                    subTitle:"Your current profile status is not Verified",
                    buttons: [
                        {
                            text: 'Okay',
                            handler: () => {
                            }
                        }
                    ]
                });
                alert.present();  
                return
            }
        }
        
        
        
        this.navCtrl.push(SiteListPage, {"user_type":this.karigar_detail.user_type, "team_exist":this.karigar_detail.team_exist})
    }
    share()
    {
        console.log("share and earn");
        // let image = "https://play-lh.googleusercontent.com/FEDtMP_dyMgM8rJtp4MFdp60g0fLuBYNbu3pBNsNH52knTsG1yDuNs56CFYu_X3XqYk=s180-rw";
        
        let image = "";
        let app_url = "https://apps.apple.com/us/app/max-cement-tech/id6444850119";
        
        this.socialSharing.share("Hey there join me (" + this.karigar_detail.full_name + "-" + this.karigar_detail.mobile_no + ") on Max Cement Tech app. Enter my code " + this.karigar_detail.referral_code + " to earn points back in your wallet!", "Karigar Reffral", image, app_url)
        .then(resp=>{
            console.log(resp);
            
        }).catch(err=>{
            console.log(err);
        }) 
    }
    showAlert(text)
    {
        let alert = this.alertCtrl.create({
            title:'Alert!',
            cssClass:'action-close',
            subTitle: text,
            buttons: ['OK']
        });
        alert.present();
    }


    showAlert_potential_bsg(text)
    {
        let alert = this.alertCtrl.create({
            title:'Alert!',
            cssClass:'action-close',
            subTitle: text,
            buttons: ['OK']
        });
        alert.present();
    }
   
    showSuccess(text)
    {
        let alert = this.alertCtrl.create({
            title:'Success!',
            cssClass:'action-close',
            subTitle: text,
            buttons: ['OK']
        });
        alert.present();
    }
    
    notification()
    {
        console.log("notification called");
        
        this.push.hasPermission()
        .then((res: any) => {
            console.log("line 413","called this functions");
            if (res.isEnabled) {
                console.log('We have permission to send push notifications');
            } else {
                console.log('We do not have permission to send push notifications');
            }
        });
        
        
        const options: PushOptions = {
            android: {
                senderID:'893824522432',
                icon: './assets/imgs/logo',
                forceShow:true
            },
            ios: {
                alert: 'true',
                badge: true,
                sound: 'true'
            },
            windows: {
                
            },
        };
        
        const pushObject: PushObject = this.push.init(options);
        
        pushObject.on('notification').subscribe((notification: any) => console.log('Received a notification', notification));
        pushObject.on('registration').subscribe((registration: any) => {
            console.log('Device registered', registration) 
            this.app_version.getVersionNumber()
            .then((resp)=>{
                console.log(resp);
                
                this.version = resp;
            this.service.post_rqst({'id':this.service.karigar_id,'registration_id':registration.registrationId,'version':this.version},'app_karigar/update_token').subscribe((r)=>
            {
                console.log(r);
                console.log("tokken saved");
                
            });
        })
        }
        );
        
        pushObject.on('error').subscribe(error => console.error('Error with Push plugin', error));
    }
    
    openModal()
    {
        let contactModal = this.modalCtrl.create(AboutusModalPage);
        contactModal.present();
        return;
    }
    get_user_lang()
    {
        this.storage.get("token")
        .then(resp=>{
            this.tokenInfo = this.getDecodedAccessToken(resp );
            
            this.service.post_rqst({"login_id":this.tokenInfo.sub},"app_karigar/get_user_lang")
            .subscribe(resp=>{
                console.log(resp);
                this.lang = resp['language'];
                console.log(this.lang);
                
                if(this.lang == "")
                {
                    this.lang = "en";
                }
                console.log(this.lang);
                this.translate.use(this.lang);
            })
        })
    }
    getDecodedAccessToken(token: string): any 
    {
        try{
            return jwt_decode(token);
        }
        catch(Error){
            return null;
        }
    } 
    initPushNotification()
    {
        // this.push.init({
        //     android: {
        //         forceShow: "true",
        //         titleKey: "hello",
        //         sound: "true",
        //         vibrate:"true"
        //     }
        // });
        
        this.push.hasPermission().then((res: any) => {
            if (res.isEnabled)
            {
                console.log('We have permission to send push notifications');
            }
            else
            {
                console.log('We don\'t have permission to send push notifications');
            }
        });
        
        const options: PushOptions = {
            android: {
                senderID: '164818354927',
                icon: './assets/imgs/logo_small',
                forceShow:true
            },
            ios: {
                alert: 'true',
                badge: true,
                sound: 'false'
            },
            windows: {}
        };
        
        const pushObject: PushObject = this.push.init(options);
        pushObject.on('notification').subscribe((notification: any) => {
            console.log('Received a notification', notification)
            console.log("notification data type",notification.additionalData.type );
            console.log("additionalData",notification.additionalData );
            this.notifications = notification.additionalData.type
            // if(notification.additionalData.type == "message"){
            //     this.navCtrl.push(FeedbackPage);
            // }
            if(notification.additionalData.type == 'offer'){
                this.navCtrl.push(OfferListPage);
            }else if(notification.additionalData.type == 'redeem'){
                this.navCtrl.push(TransactionPage);
            }else if(notification.additionalData.type == 'gift'){
                this.navCtrl.push(GiftListPage);
            }
            else if(notification.additionalData.type == 'profile'){
                this.navCtrl.push(ProfilePage);
            }
            else if(notification.additionalData.type == 'site'){
                this.navCtrl.push(SiteListPage, {"user_type":this.karigar_detail.user_type});
            }
            else if(notification.additionalData.type == 'purchase'){
                this.navCtrl.push(PurchaseListPage, {"user_type":this.karigar_detail.user_type});
            }
            else if(notification.additionalData.type == 'notification'){
                this.navCtrl.push(NotificationPage);
            }
        });
        
        
        pushObject.on('registration')
        .subscribe((registration) =>{
            
            
            console.log('Device registered line 557', registration);
            console.log('Device Token 558', registration.registrationId);
            
            this.storage.set('fcmId', registration);
            console.log( this.tokenInfo);
            console.log(this.storage);
            this.storage.get('user_type').then((user_type) => {
                this.user_type = user_type;
                console.log(this.user_type);
                console.log(user_type);
            });
            this.storage.get('userId').then((userId) => {
                this.idlogin = userId;
                console.log(this.idlogin);
                console.log(userId);
            });
            this.registration=registration.registrationId;
            this.registrationid(registration.registrationId);
            console.log("line 575==",registration.registrationId)
        });
        
        pushObject.on('error')
        .subscribe((error) =>
        console.error('Error with Push plugin', error));
    }
    registrationid(registrationId){
        console.log("enter registration line 582",registrationId);
        console.log(registrationId);
        
        
        
        this.storage.get('user_type').then((user_type) => {
            this.user_type = user_type;
            console.log(this.user_type);
            console.log(user_type);
            console.log("user_type");
            
        });
        this.storage.get('userId').then((userId) => {
            this.idlogin = userId;
            console.log(this.idlogin,  this.idlogin);
            console.log("userId");
            console.log(userId);
        });

        this.app_version.getVersionNumber()
        .then((resp)=>{
            console.log(resp);
            
            this.version = resp;
        
        setTimeout(() =>{
            this.service.post_rqst({'registration_id':registrationId,'karigar_id':this.idlogin,'version':this.version},'app_karigar/add_registration_id')
            .subscribe((r)=>
            {
                console.log("success ine 605",registrationId);
                console.log(r);
                
            });
        }, 5000);
        
    })
    }   


    karigar_potential_alert()
    {
        console.log("Check");
        this.service.post_rqst({'sales_user_id':this.service.karigar_id},'app_karigar/pc_potential_alert')
        .subscribe((r:any)=>
        {
            console.log(r);
            if(r['msg'] !=''){
                this.showAlert_potential_bsg(r['msg']);

            }   

          
        });
    }
    
}