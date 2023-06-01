import { AppVersion } from '@ionic-native/app-version';
import { Component,ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Loading, LoadingController,Nav, Events, ActionSheetController, AlertController, ModalController, Platform, App} from 'ionic-angular';
import { DbserviceProvider } from '../../providers/dbservice/dbservice';
import { Storage } from '@ionic/storage';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { ViewProfilePage } from '../view-profile/view-profile';
// import { MobileLoginPage } from '../login-section/mobile-login/mobile-login';
import { TranslateService } from '@ngx-translate/core';
import * as jwt_decode from "jwt-decode";
// import { LanguagePage } from '../language/language';
import { SocialSharing } from '@ionic-native/social-sharing';
import { LanguagePage } from '../language/language';
import { RegistrationPage } from '../login-section/registration/registration';
import { ConstantProvider } from '../../providers/constant/constant';
import { PointLocationPage } from '../point-location/point-location';




@IonicPage()
@Component({
    selector: 'page-profile',
    templateUrl: 'profile.html',
})
export class ProfilePage {
    
    @ViewChild(Nav) nav: Nav;
    karigar_detail:any={};
    loading:Loading;
    edit:any='';
    edit1:any='';
    lang:any='';
    tokenInfo:any={};
    uploadUrl:any='';
    appVersion:any=''
    version:any='';

    constructor(public navCtrl: NavController, public app: App,public app_version:AppVersion, public navParams: NavParams,public service:DbserviceProvider,public loadingCtrl:LoadingController, public storage: Storage,public events: Events,public actionSheetController: ActionSheetController,private camera: Camera,public alertCtrl:AlertController,public modalCtrl: ModalController,public db:DbserviceProvider,public translate:TranslateService,public platform:Platform,private socialSharing: SocialSharing, public constant:ConstantProvider){
        this.presentLoading();
        console.log(this.navParams);
        this.check_version();
        this.lang = this.navParams.get("lang");
        this.translate.setDefaultLang(this.lang);
        this.translate.use(this.lang);
        this.uploadUrl = this.constant.upload_url;

    }
    
    
    title:any=""
    no:any=""
    yes:any=""
    content:any=""
    
    
    logout()
    {
        
        this.translate.get("Logout")
        .subscribe(resp=>{
            this.title = resp;
        })
        
        this.translate.get("No")
        .subscribe(resp=>{
            this.no = resp;
        })
        this.translate.get("Yes")
        .subscribe(resp=>{
            this.yes = resp;
        })
        this.translate.get("Are you sure you want Logout?")
        .subscribe(resp=>{
            this.content = resp;
        })
        
        
        let alert = this.alertCtrl.create({
            title: this.title,
            message: this.content,
            buttons: [
                {
                    text: this.no,
                    handler: () => {
                        console.log('Cancel clicked');
                        // this.d.('Action Cancelled!')
                    }
                },
                {
                    text: this.yes,
                    handler: () => {
                        
                        this.storage.set('token','');
                        this.service.karigar_info='';
                        this.storage.get("token")
                        .then(resp=>{
                            console.log(resp);
                            
                        })
                        
                        let alert2 = this.alertCtrl.create({
                            title:'Success!',
                            subTitle: 'Logout Successfully',
                            buttons: [ {
                                text: 'Ok',
                                handler: () => {
                                    console.log('Cancel clicked');
                                }
                            }]
                        });
                        alert2.present();
                        this.navCtrl.setRoot(LanguagePage);
                        // this.platform.exitApp();
                        // this.navCtrl.setRoot(LanguagePage);
                        
                    }
                }
            ]
        })
        
        alert.present();
        
    }
    
    

    deleteAccount()
    {
        
        this.translate.get("Alert!")
        .subscribe(resp=>{
            this.title = resp;
        })
        
        this.translate.get("No")
        .subscribe(resp=>{
            this.no = resp;
        })
        this.translate.get("Yes")
        .subscribe(resp=>{
            this.yes = resp;
        })
        this.translate.get("Are you sure you want permanent delete account?")
        .subscribe(resp=>{
            this.content = resp;
        })
        
        
        let alert = this.alertCtrl.create({
            title: this.title,
            message: this.content,
            buttons: [
                {
                    text: this.no,
                    handler: () => {
                        console.log('Cancel clicked');
                        // this.d.('Action Cancelled!')
                    }
                },
                {
                    text: this.yes,
                    handler: () => {
                        
                        this.db.post_rqst({'id': this.karigar_detail.id}, 'app_master/delete_karigar_app')
                        .subscribe(resp=>{
                            if(resp.status == 'success'){
                                
                                
                                
                                this.storage.set('token','');
                                this.service.karigar_info='';
                                this.storage.get("token")
                                .then(resp=>{
                                    console.log(resp);
                                })
                                
                                let alert2 = this.alertCtrl.create({
                                    title:'Success!',
                                    subTitle: 'Delete Successfully',
                                    buttons: [ {
                                        text: 'Ok',
                                        handler: () => {
                                            console.log('Cancel clicked');
                                        }
                                    }]
                                });
                                alert2.present();
                                this.navCtrl.setRoot(LanguagePage);
                            }
                        })
                        
                    }
                }
            ]
        })
        
        alert.present();
        
    }
    check_version()
    {
        
        this.app_version.getVersionNumber()
        .then((resp)=>{
            console.log(resp);
            this.version = resp;

            
        })
    }
    
    cam:any="";
    gal:any="";
    cancl:any="";
    ok:any="";
    upl_file:any="";
    save_succ:any="";
    ionViewDidLoad() {
        console.log('ionViewDidLoad ProfilePage');
        // this.get_user_lang();
        
        
        this.translate.get("Camera")
        .subscribe(resp=>{
            this.cam = resp
        });
        
        this.translate.get("Gallery")
        .subscribe(resp=>{
            this.gal = resp
        });
        
        this.translate.get("Cancel")
        .subscribe(resp=>{
            this.cancl = resp
        });
        
        this.translate.get("OK")
        .subscribe(resp=>{
            this.ok = resp
        });
        
        this.translate.get("Upload File")
        .subscribe(resp=>{
            this.upl_file = resp
        });
        
        this.translate.get("Registered Successfully")
        .subscribe(resp=>{
            this.save_succ = resp
        });
        
    }
    
    ionViewWillEnter()
    {
        this.getKarigarDetail();
    }
    language:any=[];
    getKarigarDetail()
    {
        console.log('karigar');
        
        this.service.post_rqst( {'karigar_id': this.service.karigar_id },'app_karigar/profile')
        .subscribe((r) =>
        {
            console.log(r);
            this.loading.dismiss();
            console.log(this.karigar_detail);
            this.karigar_detail=r['karigar'];
            this.language=r['language'];
            
        });
    }
    
 
    
    update_lang()
    {
        console.log(this.karigar_detail);
        this.db.post_rqst({"data":this.karigar_detail},"app_karigar/update_language")
        .subscribe(resp=>{
            console.log(resp);
            this.getKarigarDetail();
            this.translate.use(this.karigar_detail.language);
        })
    }
    
    openeditprofile()
    {
        let actionsheet = this.actionSheetController.create({
            title:"Profile photo",
            cssClass: 'cs-actionsheet',
            
            buttons:[{
                cssClass: 'sheet-m',
                text: this.cam,
                icon:'camera',
                handler: () => {
                    this.takePhoto();
                }
            },
            {
                cssClass: 'sheet-m1',
                text: this.gal,
                icon:'image',
                handler: () => {
                    this.getImage();
                }
            },
            {
                cssClass: 'cs-cancel',
                text: this.cancl,
                role: 'cancel',
                handler: () => {
                }
            }]
        });
        actionsheet.present();
    }
    takePhoto()
    {
        console.log("i am in camera function");
        const options: CameraOptions = {
            // quality: 70,
            // destinationType: this.camera.DestinationType.DATA_URL,
            // targetWidth : 500,
            // targetHeight : 400,
            // cameraDirection: 1,
            // correctOrientation: true
            quality : 75, 
            destinationType : this.camera.DestinationType.DATA_URL, 
            sourceType : this.camera.PictureSourceType.CAMERA, 
            allowEdit : true,
            encodingType: this.camera.EncodingType.JPEG,
            targetWidth: 300,
            targetHeight: 300,
            saveToPhotoAlbum: false
        }
        
        console.log(options);
        this.camera.getPicture(options).then((imageData) => {
            this.karigar_detail.profile = 'data:image/jpeg;base64,' + imageData;
            console.log(this.karigar_detail.profile);
            if(this.karigar_detail.profile)
            {
                this.uploadImage(this.karigar_detail.profile);
            }
        }, (err) => {
        });
    }
    getImage() 
    {
        const options: CameraOptions = {
            quality: 70,
            destinationType: this.camera.DestinationType.DATA_URL,
            sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
            saveToPhotoAlbum:false
        }
        console.log(options);
        this.camera.getPicture(options).then((imageData) => {
            this.karigar_detail.profile = 'data:image/jpeg;base64,' + imageData;
            console.log(this.karigar_detail.profile);
            if(this.karigar_detail.profile)
            {
                this.uploadImage(this.karigar_detail.profile);
            }
        }, (err) => {
        });
    }
    uploadImage(profile)
    {
        console.log(profile);
        this.service.post_rqst( {'karigar_id': this.service.karigar_id,'profile':profile },'app_karigar/updateProfilePic')
        .subscribe((r) =>
        {
            console.log(r);
            this.showSuccess("Profile Photo Updated")   
        });
    }
    viewProfiePic()
    {
        this.modalCtrl.create(ViewProfilePage, {"Image": this.karigar_detail.profile,"type":"base_64"}).present();
    }
    viewDoc()
    {
        this.modalCtrl.create(ViewProfilePage, {"Image": this.karigar_detail.document_image,"type":"base_64"}).present();
    }
    viewDocBack()
    {
        this.modalCtrl.create(ViewProfilePage, {"Image": this.karigar_detail.document_image_back,"type":"base_64"}).present();
    }
    viewPan()
    {
        this.modalCtrl.create(ViewProfilePage, {"Image": this.karigar_detail.pan_img,"type":"base_64"}).present();
    }
    showSuccess(text)
    {
        this.translate.get("Success")
        .subscribe(resp=>{
            let alert = this.alertCtrl.create({
                title:resp+'!',
                subTitle: text,
                buttons: [this.ok]
            });
            alert.present();
        })
    }
    presentLoading() 
    {
        this.translate.get('Please wait...')
        .subscribe(resp=>{
            this.loading = this.loadingCtrl.create({
                content: resp,
                dismissOnPageChange: false
            });
            this.loading.present();
        })
    }
    
    editDealer()
    {
        console.log(this.karigar_detail);
        
        this.service.post_rqst( {'karigar_detail': this.karigar_detail },'app_karigar/editKarigarDealer')
        .subscribe((result) =>
        {
            console.log(result);
            this.edit='';
            this.translate.get("Channel Partner Information Updated")
            .subscribe(resp=>{
                this.showSuccess(resp);
                return;
            })
        });
    }
    
    MobileNumber(event: any) {
        const pattern = /[0-9]/;
        let inputChar = String.fromCharCode(event.charCode);
        if (event.keyCode != 8 && !pattern.test(inputChar)) {
            event.preventDefault();
        }
    }
    
    showAlert(text)
    {
        this.translate.get("Alert")
        .subscribe(resp=>{
            let alert = this.alertCtrl.create({
                title: resp+'!',
                cssClass:'action-close',
                subTitle: text,
                buttons: [this.ok]
            });
            alert.present();
        })
    }
    
    
    // get_user_lang()
    // {
    //     this.storage.get("token")
    //     .then(resp=>{
    //         this.tokenInfo = this.getDecodedAccessToken(resp );
    
    //         this.db.post_rqst({"login_id":this.tokenInfo.sub},"app_karigar/get_user_lang")
    //         .subscribe(resp=>{
    //             console.log(resp);
    //             this.lang = resp['language'];
    //             this.translate.setDefaultLang(this.lang)
    //             if(this.lang == "")
    //             {
    //                 this.lang = "en";
    //             }
    //             this.translate.use(this.lang);
    //         })
    //     })
    // }
    getDecodedAccessToken(token: string): any {
        try{
            return jwt_decode(token);
        }
        catch(Error){
            return null;
        }
    }
    
    share_code()
    {
        let image = "";
        let app_url = "https://apps.apple.com/us/app/max-cement-tech/id6444850119";

        
        this.socialSharing.share("Hey there join me (" + this.karigar_detail.full_name + "-" + this.karigar_detail.mobile_no + ") on Max Cement Tech app. Enter my code *" + this.karigar_detail.referral_code + "* to earn points back in your wallet!", "Karigar Reffral", image, app_url)
        .then(resp => {
            console.log(resp);
            
        }).catch(err => {
            console.log(err);
        })
    }
    
    gotoChangeLang()
    {
        this.navCtrl.push(LanguagePage,{"come_from":"homepage"});
    }
    pointLocation()
    {
        // ,{'lat':this.karigar_detail.cust_lat,'log':this.karigar_detail.cust_long}
        this.navCtrl.push(PointLocationPage);
    }
    
    data:any={}
    
    flag:boolean=true;  
    
    onUploadChange(evt: any) {
        let actionsheet = this.actionSheetController.create({
            title:this.upl_file,
            cssClass: 'cs-actionsheet',
            
            buttons:[{
                cssClass: 'sheet-m',
                text: this.cam,
                icon:'camera',
                handler: () => {
                    console.log("Camera Clicked");
                    this.takeDocPhoto();
                }
            },
            {
                cssClass: 'sheet-m1',
                text: this.gal,
                icon:'image',
                handler: () => {
                    console.log("Gallery Clicked");
                    this.getDocImage();
                }
            },
            {
                cssClass: 'cs-cancel',
                text: this.cancl,
                role: 'cancel',
                handler: () => {
                    console.log('Cancel clicked');
                }
            }]
        });
        actionsheet.present();
    }
    takeDocPhoto()
    {
        const options: CameraOptions = {
            quality: 70,
            destinationType: this.camera.DestinationType.DATA_URL,
            targetWidth : 500,
            targetHeight : 400,
            
        }
        
        console.log(options);
        this.camera.getPicture(options).then((imageData) => {
            this.karigar_detail.document_image = 'data:image/jpeg;base64,' + imageData;
            console.log(this.karigar_detail.document_image);
            if(this.karigar_detail.document_image)
            {
                this.uploadDocImage(this.karigar_detail.document_image,this.karigar_detail.document_no);
            }
        }, (err) => {
        });
    }
    
    getDocImage()
    {
        const options: CameraOptions = {
            quality: 70,
            destinationType: this.camera.DestinationType.DATA_URL,
            sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
            saveToPhotoAlbum:false
        }
        this.camera.getPicture(options).then((imageData) => {
            this.karigar_detail.document_image = 'data:image/jpeg;base64,' + imageData;
            console.log(this.karigar_detail.document_image);
            if(this.karigar_detail.document_image)
            {
                this.uploadDocImage(this.karigar_detail.document_image,this.karigar_detail.document_no);
            }
        }, (err) => {
        });
    }
    
    uploadDocImage(doc_image,doc_num)
    {
        console.log(doc_image);
        this.service.post_rqst( {'karigar_id': this.service.karigar_id,'doc_image':doc_image,'doc_no':doc_num },'app_karigar/updateDocumnet')
        .subscribe((r) =>
        {
            this.edit1='';
            this.showSuccess("Document Updated")   
        });
    }
    
    
    
    updateProfile()
    {
        this.karigar_detail.edit_profile= 'edit_profile';
        console.log(this.karigar_detail);
        this.navCtrl.push(RegistrationPage,{'data':this.karigar_detail,"mode":'edit_page'})
    }
}
