import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ActionSheetController, LoadingController, Loading, ModalController, ToastController  } from 'ionic-angular';
// import { FileTransfer, } from '@ionic-native/file-transfer';
// import { TabsPage } from './../../../pages/tabs/tabs';
import { DbserviceProvider } from '../../../providers/dbservice/dbservice';
import { Camera, CameraOptions } from '@ionic-native/camera';
import {AboutusModalPage} from '../../aboutus-modal/aboutus-modal'
import { Storage } from '@ionic/storage';
import { Content } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import { HomePage } from '../../home/home';
import { ProfilePage } from '../../profile/profile';
import { ConstantProvider } from '../../../providers/constant/constant';


@IonicPage()
@Component({
    selector: 'page-registration',
    templateUrl: 'registration.html',
})
export class RegistrationPage {
    @ViewChild(Content) content: Content;
    data:any={};
    states:any =[];
    per_states:any =[];

    citys:any =[];
    districts:any =[];
    state_list:any=[];
    district_list:any=[];
    city_list:any=[];
    pincode_list:any=[];
    selectedFile:any=[];
    file_name:any=[];
    karigar_id:any='';
    formData= new FormData();
    myphoto:any;
    profile_data:any='';
    loading:Loading;
    lang:any='en';
    today_date:any;
    whatsapp_mobile_no:any='';
    mode:string='';
    uploadurl: any = "";
    
    constructor(public navCtrl: NavController, public toastCtrl: ToastController,public navParams: NavParams, public service:DbserviceProvider,public alertCtrl:AlertController ,public actionSheetController: ActionSheetController,private camera: Camera,private loadingCtrl:LoadingController,public modalCtrl: ModalController,private storage:Storage,public translate:TranslateService, public constant:ConstantProvider) {
        this.uploadurl = this.constant.upload_url;
        this.data.mobile_no = this.navParams.get('mobile_no');
        this.lang = this.navParams.get('lang');

        console.log(this.data.mobile_no);
        this.mode = navParams.get('mode')
        this.data.profile='';
        this.data.document_image='';
        this.data.pan_img='';
        this.data.document_image_back='';
        this.data.user_type=1;
        this.getStateList();
        console.log(navParams);
        
        this.today_date = new Date().toISOString().slice(0,10);
        
        if(navParams.data.data){
            this.data = navParams.data.data;
            console.log(this.data);
             if(this.data.confirm_account !='0'){
                this.data.confirm_account = this.data.account_no;

             }

            if(navParams.data.data.doa == '0000-00-00'){
                this.data.doa = '';
            }
            if(navParams.data.data.dob == '0000-00-00'){
                this.data.dob = '';
            }
            if(this.data.confirm_account == 0){
                this.data.confirm_account = '';
            }
            
           
            this.data = JSON.parse(JSON.stringify(navParams.data.data));
            this.data.state={};
            this.data.state['state_name']=navParams.data.data.state;
            
            this.data.district={};
            this.data.district['district_name']=navParams.data.data.district;

            this.data.city={};
            this.data.city['city_name']=navParams.data.data.city;
            console.log(this.data.city['city_name']);

            // this.data.permanent_state={};
            this.data.permanent_state=navParams.data.data.permanent_state;
            console.log(this.data.permanent_state);
            

            
            // this.data.parmanent_district={};
            this.data.parmanent_district=navParams.data.data.parmanent_district;
            console.log(this.data.parmanent_district);

            // this.data.permanent_city={};
            this.data.permanent_city=navParams.data.data.permanent_city
            console.log(this.data.permanent_city);
            

            
            this.getDistrictList(this.data.state['state_name']);
            this.getCityList(this.data.district['district_name']);
            this.getDistrictList2(this.data.permanent_state['state_name']);
            this.getCityList2(this.data.parmanent_district['district_name']);
            this.data.karigar_edit_id = this.data.id;
            this.data.profile_edit_id = this.data.id;
            this.data.doc_edit_id = this.data.id;
            this.data.doc_back_edit_id = this.data.id;
            this.data.doc_pan_id = this.data.id;
            this.data.cheque_image_id = this.data.id;


            if(this.data.state){
                this.getDistrictList(this.data.state);
            }
            if(this.data.permanent_state){
                this.getDistrictList2(this.data.permanent_state);
            }
            this.getCityList(this.data.district);
            this.getCityList2(this.data.parmanent_district);
        }
        
        console.log(this.data.karigar_edit_id);
        
    }
    
    cam:any="";
    gal:any="";
    cancl:any="";
    ok:any="";
    upl_file:any="";
    save_succ:any="";
    ionViewDidLoad() {
        
        this.translate.setDefaultLang(this.lang);
        this.translate.use(this.lang);
        if (this.data.state) {
            this.getDistrictList(this.data.state);
        }
        if (this.data.permanent_state) {
            
            this.getDistrictList2(this.data.permanent_state);
        }
        console.log(this.data);
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
    
    
    getStateList(){
        this.service.post_rqst({}, 'master/getLocationStates')
        .subscribe(d => { 
            this.states = d.locationStates;
            this.per_states = d.locationStates;

            let index=this.per_states.findIndex(row=> row.state_name==this.data.permanent_state)
            console.log(index);
            
                this.data.permanent_state=this.per_states[index];
                console.log( this.data.permanent_state);
                


        });
    }
    

    onCheckSameAsAddressHandler(event) {

        console.log(event);

        if (event.checked) {

          this.data.permanent_state = this.data.state;
          this.data.parmanent_district = this.data.district;
          this.data.permanent_pincode = this.data.pincode;
          this.data.permanent_city = this.data.city;
          this.data.permanent_address = this.data.address;
        //   this.getDistrictList2('');

        } else {

          this.data.permanent_state = '';
          this.data.parmanent_district = '';
          this.data.permanent_pincode = '';
          this.data.permanent_city = '';
          this.data.permanent_address = '';

        }
      }

    getDistrictList(state_name){
        console.log(state_name);
        
        this.service.post_rqst({'state_name':state_name}, 'master/getLocationDistricts')
        .subscribe(d => { 
            
            this.districts = d.locationDistricts;
        });
    }
    
    getCityList(district){
        this.service.post_rqst({'district_name':district}, 'master/getLocationCitys')
        .subscribe(d => { 
            
            this.citys = d.locationCitys;
        });
    }  
    per_districts:any =[];

    getDistrictList2(state_name){
        console.log(state_name);
              
        this.service.post_rqst({state_name}, 'master/getLocationDistricts')
        .subscribe(d => { 
            
            this.per_districts = d.locationDistricts;
            let index=this.per_districts.findIndex(row=> row.district_name==this.data.parmanent_district )
            console.log(index);
            if(index != -1 ){
                this.data.parmanent_district=this.per_districts[index];

            }
        });
    }

    per_citys:any =[];
    
    getCityList2(district_name){
        this.service.post_rqst({district_name}, 'master/getLocationCitys')
        .subscribe(d => { 
            
            this.per_citys = d.locationCitys;
            let index=this.per_citys.findIndex(row=> row.city_name==this.data.permanent_city )
            console.log(index);
            if(index != -1 ){
                this.data.permanent_city=this.per_citys[index];

            }
        });
    }
    
    getZoneList(city){
        this.service.post_rqst({'city_name':city}, 'master/getLocationZones')
        .subscribe(d => { 
            console.log(d);
            this.data.sales_zone = d.locationZones.zone;
        });
    }
    
    scrollUp()
    {
        this.content.scrollToTop();
    } 
    
    clearDOA(){
        this.data.doa ='';
    }
    clearDOB(){
        this.data.dob ='';
    }
    
    presentToast(msg) {
        console.log(msg);
        const toast = this.toastCtrl.create({
            message: msg,
            duration: 3000
        });
        toast.present();
    }
    
    submit()
    {
        this.data.lang = this.lang;
        this.data.created_by='0';
        if(this.data.document_type == 'Adhaar card'){
            if(!this.data.document_image){
                this.presentToast( this.data.document_type + '' + ' image required');
                return
            }
            else if(this.data.document_type == 'Adhaar card'){
                if(!this.data.document_image_back){
                    this.presentToast( this.data.document_type + '' + ' back side image required');
                    return
                }
            }
        }
        
        if(!this.data.pan_img){
            this.presentToast('PanCard image and number are required' );
            return
          }
          if(!this.data.profile){
            this.presentToast('Profile image are required' );
            return
          }
        if(this.data.account_no != this.data.confirm_account ){
            this.presentToast('Account Number and Confirm Account Number not match');
            return
        }
        if(this.data.account_no &&  this.data.confirm_account && this.data.ifsc_code && this.data.bank_name &&  this.data.account_holder_name){
            if(!this.data.cheque_image){
                this.presentToast('Cheque image are required');
                return
            }
           
        }
        this.data.state = this.data.state.state_name;
        this.data.district = this.data.district.district_name;
        this.data.city = this.data.city.city_name;
if(this.data.user_type != '2'){
    this.data.permanent_state = this.data.permanent_state.state_name;
    this.data.parmanent_district = this.data.parmanent_district.district_name;
    this.data.permanent_city = this.data.permanent_city.city_name;

}
      this.data.confirm_account = '1';
        this.presentLoading();
        this.service.post_rqst( {'karigar': this.data },'app_karigar/addKarigar')
        .subscribe( (r) =>
        {
            console.log(r);
            this.loading.dismiss();
            this.karigar_id=r['id'];
            console.log(this.karigar_id);
            
            
            if(r['status'] == 'UPDATED')
            {
                this.navCtrl.push(HomePage);    
            }
            
            
            if(r['status']=="SUCCESS")
            {
                this.showSuccess(this.save_succ+"!");
                this.service.post_rqst({'mobile_no': this.data.mobile_no ,'mode' :'App'},'auth/login')
                .subscribe( (r) =>
                {
                    console.log(r);
                    if(r['status'] == 'NOT FOUND')
                    {
                        return;
                    } 
                    else if(r['status'] == 'ACCOUNT SUSPENDED')
                    {
                        this.translate.get("Your account has been suspended")
                        .subscribe(resp=>{
                            this.showAlert(resp);
                        })
                        return;
                    }
                    else if(r['status'] == 'SUCCESS')
                    {
                        this.storage.set('token',r['token']); 
                        this.service.karigar_id=r['user'].id;
                        this.service.karigar_status=r['user'].status;
                        console.log(this.service.karigar_id);
                        
                        if(r['user'].status !='Verified' && r['user'].user_type!=3)
                        {
                            let contactModal = this.modalCtrl.create(AboutusModalPage);
                            contactModal.present();
                            return;
                        }
                    }
                    // this.navCtrl.push(TabsPage);
                    this.navCtrl.push(HomePage);
                });
            }
            else if(r['status']=="EXIST")
            {
                this.translate.get("Already Registered")
                .subscribe(resp=>{
                    this.showAlert(resp+"!");
                })
            }
        });
    }
    namecheck(event: any) 
    {
        console.log("called");
        
        const pattern = /[A-Z\+\-\a-z ]/;
        let inputChar = String.fromCharCode(event.charCode);
        if (event.keyCode != 8 && !pattern.test(inputChar)) 
        {event.preventDefault(); }
    }
    
    
    
    
    MobileNumber(event: any) {
        const pattern = /[0-9]/;
        let inputChar = String.fromCharCode(event.charCode);
        if (event.keyCode != 8 && !pattern.test(inputChar)) {
            event.preventDefault();
        }
    }
    
    caps_add(add:any)
    {
        this.data.address = add.replace(/\b\w/g, l => l.toUpperCase());
    }
    
    caps_add2(add:any)
    {
        this.data.permanent_address = add.replace(/\b\w/g, l => l.toUpperCase());
    }
    
  
    showSuccess(text)
    {
        this.translate.get("Success")
        .subscribe(resp=>{
            let alert = this.alertCtrl.create({
                title:resp+'!',
                cssClass:'action-close',
                subTitle: text,
                buttons: [this.ok]
            });
            alert.present();
        })
    }
    showAlert(text) 
    {
        this.translate.get("Alert")
        .subscribe(resp=>{
            let alert = this.alertCtrl.create({
                title:resp+'!',
                cssClass:'action-close',
                subTitle: text,
                buttons: [this.ok]
            });
            alert.present();
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
                    console.log("Camera Clicked");
                    this.takePhoto();
                }
            },
            {
                cssClass: 'sheet-m1',
                text: this.gal,
                icon:'image',
                handler: () => {
                    console.log("Gallery Clicked");
                    this.getImage();
                }
            },
            {
                cssClass: 'cs-cancel',
                text: this.cancl,
                role: 'cancel',
                handler: () => {
                    this.data.profile_edit_id = this.data.id;
                    console.log('Cancel clicked');
                }
            }
        ]
    });
    actionsheet.present();
}
takePhoto()
{
    console.log("i am in camera function");
    const options: CameraOptions = {
        quality: 75,
        destinationType: this.camera.DestinationType.DATA_URL,
        targetWidth : 1050,
        targetHeight : 1000,
        cameraDirection: 1,
        correctOrientation: true
    }
    
    console.log(options);
    this.camera.getPicture(options).then((imageData) => {
        this.data.profile_edit_id = '';
        this.data.profile = 'data:image/jpeg;base64,' + imageData;
        console.log(this.data.profile);
    }, (err) => {
    });
}
getImage() 
{
    const options: CameraOptions = {
        quality: 75,
        destinationType: this.camera.DestinationType.DATA_URL,
        sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
        saveToPhotoAlbum:false
    }
    console.log(options);
    this.camera.getPicture(options).then((imageData) => {
        this.data.profile_edit_id = '';
        this.data.profile = 'data:image/jpeg;base64,' + imageData;
        console.log(this.data.profile);
    }, (err) => {
    });
}

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
                this.takeDocPhoto();
            }
        },
        {
            cssClass: 'sheet-m1',
            text: this.gal,
            icon:'image',
            handler: () => {
                this.getDocImage();
            }
        },
        {
            cssClass: 'cs-cancel',
            text: this.cancl,
            role: 'cancel',
            handler: () => {
                this.data.doc_edit_id = this.data.id;
                console.log('Cancel clicked');
            }
        }
    ]
});
actionsheet.present();
}
takeDocPhoto()
{
    const options: CameraOptions = {
        quality: 75,
        destinationType: this.camera.DestinationType.DATA_URL,
        targetWidth : 1050,
        targetHeight : 1000 
    }
    
    console.log(options);
    this.camera.getPicture(options).then((imageData) => {
        this.flag=false;
        this.data.doc_edit_id='',
        this.data.document_image = 'data:image/jpeg;base64,' + imageData;
        console.log(this.data.document_image, 'line number 450');
    }, (err) => {
    });
}
getDocImage()
{
    const options: CameraOptions = {
        quality: 75,
        destinationType: this.camera.DestinationType.DATA_URL,
        sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
        saveToPhotoAlbum:false
    }
    console.log(options);
    this.camera.getPicture(options).then((imageData) => {
        this.flag=false;
        this.data.doc_edit_id='';
        this.data.document_image = 'data:image/jpeg;base64,' + imageData;
        console.log(this.data.document_image);
    }, (err) => {
    });
}


onUploadBackChange(evt: any) {
    let actionsheet = this.actionSheetController.create({
        title:this.upl_file,
        cssClass: 'cs-actionsheet',
        buttons:[{
            cssClass: 'sheet-m',
            text: this.cam,
            icon:'camera',
            handler: () => {
                this.backDocPhoto();
            }
        },
        {
            cssClass: 'sheet-m1',
            text: this.gal,
            icon:'image',
            handler: () => {
                this.backDocImage();
            }
        },
        {
            cssClass: 'cs-cancel',
            text: this.cancl,
            role: 'cancel',
            handler: () => {
                this.data.doc_back_edit_id = this.data.id;
            }
        }
    ]
});
actionsheet.present();
}
backDocPhoto()
{
    const options: CameraOptions = {
        quality: 75,
        destinationType: this.camera.DestinationType.DATA_URL,
        targetWidth : 1050,
        targetHeight : 1000
    }
    
    console.log(options);
    this.camera.getPicture(options).then((imageData) => {
        this.flag=false;
        this.data.doc_back_edit_id=''
        this.data.document_image_back = 'data:image/jpeg;base64,' + imageData;
        console.log(this.data.document_image_back);
    }, (err) => {
    });
}
backDocImage()
{
    const options: CameraOptions = {
        quality: 75,
        destinationType: this.camera.DestinationType.DATA_URL,
        sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
        saveToPhotoAlbum:false
    }
    console.log(options);
    this.camera.getPicture(options).then((imageData) => {
        this.flag=false;
        this.data.doc_back_edit_id='';
        this.data.document_image_back = 'data:image/jpeg;base64,' + imageData;
        console.log(this.data.document_image_back);
    }, (err) => {
    });
}



onUploadPan(evt: any) {
    let actionsheet = this.actionSheetController.create({
        title:this.upl_file,
        cssClass: 'cs-actionsheet',
        buttons:[{
            cssClass: 'sheet-m',
            text: this.cam,
            icon:'camera',
            handler: () => {
                this.panPhoto();
            }
        },
        {
            cssClass: 'sheet-m1',
            text: this.gal,
            icon:'image',
            handler: () => {
                this.panImage();
            }
        },
        {
            cssClass: 'cs-cancel',
            text: this.cancl,
            role: 'cancel',
            handler: () => {
                this.data.doc_pan_id = this.data.id;
            }
        }
    ]
});
actionsheet.present();
}
panPhoto()
{
    const options: CameraOptions = {
        quality: 75,
        destinationType: this.camera.DestinationType.DATA_URL,
        targetWidth : 1050,
        targetHeight : 1000
    }
    
    console.log(options);
    this.camera.getPicture(options).then((imageData) => {
        this.flag=false;
        this.data.doc_pan_id=''
        this.data.pan_img = 'data:image/jpeg;base64,' + imageData;
    }, (err) => {
    });
}
panImage()
{
    const options: CameraOptions = {
        quality: 75,
        destinationType: this.camera.DestinationType.DATA_URL,
        sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
        saveToPhotoAlbum:false
    }
    console.log(options);
    this.camera.getPicture(options).then((imageData) => {
        this.flag=false;
        this.data.doc_pan_id='';
        this.data.pan_img = 'data:image/jpeg;base64,' + imageData;
    }, (err) => {
    });
}





presentLoading() 
{
    this.translate.get("Please wait...")
    .subscribe(resp=>{
        this.loading = this.loadingCtrl.create({
            content: resp,
            dismissOnPageChange: false
        });
        this.loading.present();
    })
    
}



noDocument(){
    this.data.document_type = '';
}



account:any={};
flag2:boolean=false;  

check_bank_account(account_no)
{
    // if(account_no){
    //     this.flag2 = true;
    //     console.log('check confirm value',this.flag2);
        
    // }
   
    this.service.post_rqst({'account_no':account_no},'app_karigar/checkAccount')
    .subscribe( (r) =>
    {
        console.log(r);
        
        if(r.status== "exist"){
            this.presentToast('Account no. already exist');
            return
        }
    });
}

addSpace=(value)=>{
    if(value.length == 4 || value.length == 9){
        this.data.document_no = value.concat('-')
        console.log("add space===>",this.data.document_no )
    }
}

onUploadChequeImg(evt: any) {
    let actionsheet = this.actionSheetController.create({
        title:this.upl_file,
        cssClass: 'cs-actionsheet',
        buttons:[{
            cssClass: 'sheet-m',
            text: this.cam,
            icon:'camera',
            handler: () => {
                this.chequePhoto();
            }
        },
        {
            cssClass: 'sheet-m1',
            text: this.gal,
            icon:'image',
            handler: () => {
                this.chequeImage();
            }
        },
        {
            cssClass: 'cs-cancel',
            text: this.cancl,
            role: 'cancel',
            handler: () => {

                this.data.cheque_image_id  = this.data.id;
            }
        }
    ]
});
actionsheet.present();
}
chequePhoto()
{
    const options: CameraOptions = {
        quality: 75,
        destinationType: this.camera.DestinationType.DATA_URL,
        targetWidth : 1050,
        targetHeight : 1000
    }
    
    console.log(options);
    this.camera.getPicture(options).then((imageData) => {
        this.flag=false;
        this.data.cheque_image_id ='';
        this.data.cheque_image = 'data:image/jpeg;base64,' + imageData;
        
        console.log(this.data.cheque_image);
    }, (err) => {
    });
}
chequeImage()
{
    const options: CameraOptions = {
        quality: 70,
        destinationType: this.camera.DestinationType.DATA_URL,
        sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
        saveToPhotoAlbum:false
    }
    console.log(options);
    this.camera.getPicture(options).then((imageData) => {
        this.flag=false;
        this.data.cheque_image_id ='';
        this.data.cheque_image = 'data:image/jpeg;base64,' + imageData;
        console.log(this.data.cheque_image);
    }, (err) => {
    });
}

}
