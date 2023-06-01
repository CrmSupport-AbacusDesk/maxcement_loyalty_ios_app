import { Component, ViewChild } from '@angular/core';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { TranslateService } from '@ngx-translate/core';
import { ActionSheetController, AlertController, Content, IonicPage, Loading, LoadingController, ModalController, NavController, NavParams, ToastController } from 'ionic-angular';
import { ConstantProvider } from '../../providers/constant/constant';
import { DbserviceProvider } from '../../providers/dbservice/dbservice';
import { DealerListPage } from '../dealer-list/dealer-list';
import { PcListPage } from '../pc-list/pc-list';

/**
* Generated class for the UserAddPage page.
*
* See https://ionicframework.com/docs/components/#navigation for more info on
* Ionic pages and navigation.
*/

@IonicPage()
@Component({
  selector: 'page-user-add',
  templateUrl: 'user-add.html',
})
export class UserAddPage {
  @ViewChild(Content) content: Content;
  data:any={};
  states:any =[];
  citys:any =[];
  districts:any =[];

  per_citys:any =[];
  per_states:any =[];
  per_districts:any =[];


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
  regUser:any =''
  uploadurl: any = "";
  userFilter:any;
  constructor(public navCtrl: NavController, public toastCtrl: ToastController,public navParams: NavParams, public service:DbserviceProvider,public alertCtrl:AlertController ,public actionSheetController: ActionSheetController,private camera: Camera,private loadingCtrl:LoadingController,public modalCtrl: ModalController,public translate:TranslateService, public constant:ConstantProvider) {
    console.log();
    this.data.sales_user_id = this.service.karigar_id;
    console.log(this.navParams);
    
    this.uploadurl = this.constant.upload_url;
    this.data.mobile_no = this.navParams.get('mobile_no');
    this.mode = navParams.get('mode')
    this.data.profile='';
    this.data.pan_img='';
    this.data.cheque_image='';
    this.data.document_image='';
    this.data.document_image_back='';
    this.regUser = navParams.data['user_type'];
    if(this.regUser == 'Pc'){
      this.userFilter = navParams.data['userFilter'];
      if(this.userFilter == '1'){
        this.data.user_type = 1;
      }
      else{
        this.data.user_type = 4;
      }
    }
    else{
      this.data.user_type = 2;
    }
    
    this.getStateList();
    
    this.today_date = new Date().toISOString().slice(0,10);
    
    if(navParams.data.data){
      this.data = navParams.data.data;
      this.data.karigar_edit_id = this.data.id;
      this.data.profile_edit_id = this.data.id;
      this.data.doc_edit_id = this.data.id;
      this.data.doc_back_edit_id = this.data.id;
      this.data.cheque_image_id  = this.data.id;
      this.getDistrictList(this.data.state);
      this.getCityList(this.data.district);
      this.getDistrictList2(this.data.permanent_state);
      this.getCityList2(this.data.parmanent_district);
    }
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

    });
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


  
  getDistrictList2(state_name){
    console.log(state_name);
    
    this.service.post_rqst({'state_name':state_name}, 'master/getLocationDistricts')
    .subscribe(d => { 
      
      this.per_districts = d.locationDistricts;
    });
  }
  
  getCityList2(district){
    this.service.post_rqst({'district_name':district}, 'master/getLocationCitys')
    .subscribe(d => { 
      
      this.per_citys = d.locationCitys;
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
  
  presentToast(msg) {
    console.log(msg);
    const toast = this.toastCtrl.create({
      message: msg,
      duration: 3000
    });
    toast.present();
  }
  
  checkMobile(mobile){
    if(mobile.length == 10){
      this.service.post_rqst( {'mobile_no': mobile },'app_karigar/verifyMobileno')
      .subscribe( (r) =>
      {
        if(r.status == 'EXIST'){
          this.showAlert(mobile + ' Mobile number already exist!');
          this.data.mobile_no=''
          return;
        }
        console.log(r);
      });
    }
    
  }
  
  noDocument(){
    this.data.document_type = '';
  }
  
  clearDOA(){
    this.data.doa ='';
  }
  clearDOB(){
    this.data.dob ='';
  }
  
  submit()
  {
    
    this.data.lang = this.lang;
    this.data.created_by=this.service.karigar_id;
    
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
          this.presentToast('PanCard image required' );
          return
        }
        if(this.data.account_no != this.data.confirm_account ){
          this.presentToast('Account Number and Confirm Account Number not match');
          return
      }
    this.presentLoading();
    this.service.post_rqst( {'karigar': this.data },'app_karigar/addKarigar')
    .subscribe( (r) =>
    {
      console.log(r);
      this.loading.dismiss();
      // this.karigar_id=r['id'];
      if(r['status'] == 'SUCCESS'){
        this.showSuccess(this.save_succ+"!");
        if(this.regUser == 'Pc'){
          this.navCtrl.popTo(PcListPage)
        }
        else{
          this.navCtrl.popTo(DealerListPage)
        }
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



account:any={};
check_bank_account(account_no)
{


  this.service.post_rqst({'account_no':account_no},'app_karigar/checkAccount')
  .subscribe( (r) =>
  {
    console.log(r);
    
    if(r.status== "exist"){
      this.presentToast('Account number already exist');
      return
    }
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
              this.data.doc_back_edit_id = this.data.id;
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


onCheckSameAsAddressHandler(event) {

  console.log(event);

  if (event.checked) {

    this.data.permanent_state = this.data.state;
    this.data.parmanent_district = this.data.district;
    this.data.permanent_pincode = this.data.pincode;
    this.data.permanent_city = this.data.city;
    this.data.permanent_address = this.data.address;
    this.getDistrictList2('');
    this.getCityList2('');


  } else {

    this.data.permanent_state = '';
    this.data.parmanent_district = '';
    this.data.permanent_pincode = '';
    this.data.permanent_city = '';
    this.data.permanent_address = '';

  }
}


caps_add2(add:any)
{
    this.data.permanent_address = add.replace(/\b\w/g, l => l.toUpperCase());
}

}
