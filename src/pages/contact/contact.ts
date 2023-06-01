import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, App, ActionSheetController, LoadingController, ToastController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import * as jwt_decode from "jwt-decode";
import { TranslateService } from '@ngx-translate/core';
import { DbserviceProvider } from '../../providers/dbservice/dbservice';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { ConstantProvider } from '../../providers/constant/constant';
import { NgForm } from '@angular/forms';

@IonicPage()
@Component({
  selector: 'page-contact',
  templateUrl: 'contact.html',
})
export class ContactPage {
  data:any={};
  Support_hist:any = [];
  tokenInfo:any={};
  types: string = "Contact";
  lang:any='';
  flag:boolean=true;  
  ok:any="";
  cam:any="";
  gal:any="";
  cancl:any="";
  upl_file:any="";
  save_succ:any="";
  upload_url:any = "";
  karigar_info:any={};
  loading: any;
  
  Support_Type:any=[];
  support_image:any=[];
  show_existFile:any=[];
  selectedFile:any=[];
  file_name:any='';
  
  
  constructor(public navCtrl: NavController ,public actionSheetController: ActionSheetController, private camera: Camera, public service:DbserviceProvider, public navParams: NavParams,private app:App,public db:DbserviceProvider,public storage:Storage,public translate:TranslateService, public contsn:ConstantProvider,public loadingCtrl:LoadingController,  public toastCtrl:ToastController) {
    this.Support_Types();
    this.Support_history();
    this.karigar_detail();
  }
  
  
  Support_Types()
  {
      
      this.service.post_rqst({},'app_karigar/category_list')
      .subscribe( (r) =>
      {
          console.log(r);
          this.Support_Type=r.category_data;
          
      });
  }

  Support_history()
  {
    
    this.service.post_rqst({'karigar_id':this.service.karigar_id},'app_karigar/karigar_support_list')
    .subscribe( (r) =>
    {
      console.log(r);
      this.Support_hist=r.data;
      
    });
  }
  
  
  
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
          // this.data.doc_edit_id = this.data.id;
          console.log('Cancel clicked');
        }
      }
    ]
  });
  actionsheet.present();
}

selImages:any =[];
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
    this.data.image = 'data:image/jpeg;base64,' + imageData;
    this.selImages.push({"image":this.data.image});
    this.data.images = this.selImages;
    console.log(this.data, 'line number 168');
    
    this.data.image='';
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
    this.data.image = 'data:image/jpeg;base64,' + imageData;
    this.selImages.push({"image":this.data.image});
    this.data.images = this.selImages;
    console.log(this.data, 'line number 188');
    
  }, (err) => {
  });
}

submit(f: NgForm){
  this.data.karigar_info = this.karigar_info;
  this.data.file = this.selImages;
  console.log(this.data);
  this.presentLoading(); 
  this.service.post_rqst({'data':this.data},'app_karigar/submit_support')
  .subscribe( (r) =>
  {
    this.loading.dismiss();
    console.log(r);
    if(r.status == "success"){
      console.log(this.karigar_info);
      this.selImages=[];
      f.resetForm();
      console.log(this.data);
      let toast = this.toastCtrl.create({
        message: "Support Query Successfully Added",
        duration: 3000
      });
      
      toast.present();
      this.Support_history();
    }else{
      // let toast = this.toastCtrl.create({
      //     message: "Check Internet Connection, Try Again",
      //     duration: 3000
      // });
      // toast.present();
    }
    
  },(err)=>
  {
    this.loading.dismiss();
    let toast = this.toastCtrl.create({
      message: "Check Internet Connection, Try Again",
      duration: 3000
    });
    toast.present();
  });
}

delete_img(index){
  this.selImages.splice(index,1);
}

karigar_detail()
{
  this.storage.get("token")
  .then(resp=>{
    this.tokenInfo = this.getDecodedAccessToken(resp );
    
    this.service.post_rqst({'karigar_id':this.tokenInfo.sub },'app_karigar/profile')
    .subscribe((r)=>
    {
      console.log(r);
      if(r['status'] == "SUCCESS"){
        
        this.karigar_info = r['karigar'];
        console.log(this.karigar_info);
      }
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
go_to_map()
{
  
  console.log('map');
  let destination = 30.0988887 + ',' + 77.1937138;
  let label = encodeURI('Hafizpur Road, Vill, Damla, Yamuna Nagar - 135001, Haryana, India');
  window.open('geo:0,0?q=' + destination + '(' + label + ')', '_system');
}
ionViewDidLeave()
{
  this.get_user_lang();
  let nav = this.app.getActiveNav();
  if(nav && nav.getActive()) 
  {
    let activeView = nav.getActive().name;
    let previuosView = '';
    if(nav.getPrevious() && nav.getPrevious().name)
    {
      previuosView = nav.getPrevious().name;
    }  
    console.log(previuosView); 
    console.log(activeView);  
    console.log('its leaving');
    if((activeView == 'HomePage' || activeView == 'GiftListPage' || activeView == 'TransactionPage' || activeView == 'ProfilePage' ||activeView =='MainHomePage') && (previuosView != 'HomePage' && previuosView != 'GiftListPage'  && previuosView != 'TransactionPage' && previuosView != 'ProfilePage' && previuosView != 'MainHomePage')) 
    {
      
      console.log(previuosView);
      this.navCtrl.popToRoot();
    }
  }
}

get_user_lang()
{
  this.storage.get("token")
  .then(resp=>{
    this.tokenInfo = this.getDecodedAccessToken(resp );
    
    this.db.post_rqst({"login_id":this.tokenInfo.sub},"app_karigar/get_user_lang")
    .subscribe(resp=>{
      console.log(resp);
      this.lang = resp['language'];
      if(this.lang == "")
      {
        this.lang = "en";
      }
      this.translate.use(this.lang);
    })
  })
}

}
