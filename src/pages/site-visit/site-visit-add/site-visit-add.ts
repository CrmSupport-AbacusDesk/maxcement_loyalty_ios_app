import { Component, ViewChild } from '@angular/core';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { Geolocation } from '@ionic-native/geolocation';
import { LocationAccuracy } from '@ionic-native/location-accuracy';
import { TranslateService } from '@ngx-translate/core';
import { ActionSheetController, AlertController, Content, IonicPage, Loading, LoadingController, NavController, NavParams, ToastController } from 'ionic-angular';
import { ConstantProvider } from '../../../providers/constant/constant';
import { DbserviceProvider } from '../../../providers/dbservice/dbservice';
import { SiteVisitListPage } from '../site-visit-list/site-visit-list';

/**
* Generated class for the SiteVisitAddPage page.
*
* See https://ionicframework.com/docs/components/#navigation for more info on
* Ionic pages and navigation.
*/

@IonicPage()
@Component({
  selector: 'page-site-visit-add',
  templateUrl: 'site-visit-add.html',
})
export class SiteVisitAddPage {
  @ViewChild(Content) content: Content;
  
  siteform: any = {};
  locations:any =[];
  image = new FormData();
  filter:any = {};
  flag:boolean=true;  
  saveFlag = false;
  id:any
  dealers:any =[];
  
  loading:Loading;
  pcs:any =[];
  cam:any="";
  gal:any="";
  cancl:any="";
  ok:any="";
  upl_file:any="";
  save_succ:any="";
  uploadUrl:any="";
  update_succ:any="";
  userType:any ="";
  lat:any;
  long:any;
  loactionId:any
  
  constructor(public navCtrl: NavController, public navParams: NavParams, public toastCtrl: ToastController, public dbService:DbserviceProvider, public loadingCtrl:LoadingController, public actionSheetController: ActionSheetController, public translate:TranslateService, private geolocation: Geolocation, public locationaccuracy: LocationAccuracy, private camera: Camera, public con:ConstantProvider, public alertCtrl: AlertController,) {
    this.loactionId = this.navParams.get('id');
    this.uploadUrl = this.con.upload_url;
    this.siteList();
    
    
    
    
    
    
    
  }
  
  showUpdate(text)
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
  
  ionViewDidLoad() {
    
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
    
    this.translate.get("Checkin Successfully")
    .subscribe(resp=>{
      this.save_succ = resp
    });
    
    this.translate.get("Updated Successfully")
    .subscribe(resp=>{
      this.update_succ = resp
    });
  }
  
  
  siteList(){
    this.filter.limit = 0;
    this.filter.pc_id = this.dbService.karigar_id;
    this.dbService.post_rqst( { 'filter': this.filter}, 'app_karigar/getPCSites').subscribe( r =>
      {
        console.log(r);
        this.locations = r.site_locations;
      });
      return this.locations
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
    
    this.locationaccuracy.request(this.locationaccuracy.REQUEST_PRIORITY_HIGH_ACCURACY)
    .then(() => {
      let options = {
        maximumAge: 10000, timeout: 15000, enableHighAccuracy: false
      };
      this.geolocation.getCurrentPosition(options)
      .then((resp) => {
        console.log('response geolocation', resp);
        console.log(this.lat);
        console.log(this.lat);
        this.lat = resp.coords.latitude
        this.long = resp.coords.longitude;
        
        
        const options: CameraOptions = {
          quality: 75,
          destinationType: this.camera.DestinationType.DATA_URL,
          targetWidth : 1050,
          targetHeight : 1000 
        }
        this.camera.getPicture(options).then((imageData) => {
          console.log(this.lat, 'line number 200');
          console.log(this.long, 'line number 201');
          this.flag=false;
          this.siteform.image = 'data:image/jpeg;base64,' + imageData;
          this.selImages.push({"image":this.siteform.image, 'visit_image_lat':this.lat,  'visit_image_long':this.long});
          this.siteform.images = this.selImages;
          console.log(this.siteform, 'line number 206');
          
          this.siteform.image='';
        }, (err) => {
        });
        
        
      },
      error => {
        console.log('Error requesting location permissions', error);
        if(error){
          let alert = this.alertCtrl.create({
            title:'Alert!',
            cssClass:'action-close',
            subTitle:"Enable to get your location",
            buttons: ['OK']
          });
          alert.present();  
        }
        
      });
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
      this.siteform.image = 'data:image/jpeg;base64,' + imageData;
      this.selImages.push({"image":this.siteform.image});
      this.siteform.images = this.selImages;
      console.log(this.siteform, 'line number 188');
      
    }, (err) => {
    });
  }

  presentToast(msg) {
    console.log(msg);
    const toast = this.toastCtrl.create({
        message: msg,
        duration: 3000
    });
    toast.present();
  }

  
  submit(){
    
    this.siteform.created_by = this.dbService.karigar_id;
    this.siteform.site_lat = this.lat;
    this.siteform.site_long = this.long;
    this.siteform.site_location_id = this.loactionId;

    if(this.selImages.length <= 0){
      this.presentToast('Please upload atleast one picture');
      return
    }


    this.saveFlag = true;
    this.dbService.post_rqst( {'data':this.siteform},'app_karigar/siteVisitAdd ').subscribe( r =>
      {
        if(r['status'] == 'SUCCESS'){
          this.showUpdate(this.save_succ+"!");
          this.navCtrl.popTo(SiteVisitListPage);
        }
      });
    }
    
    deleteImage(index,data)
    {
      console.log(data);
      
      this.dbService.post_rqst({"id":data},"app_karigar/deleteSiteLocationImage")
      .subscribe(resp=>{
        console.log(resp);
        this.selImages.splice(index,1)
      });
    }
    
    showConfirm(index,data) {
      const confirm = this.alertCtrl.create({
        title: 'Are you sure?',
        message: 'You want to delete this!',
        buttons: [
          {
            text: 'No, cancel!',
            handler: () => {
            }
          },
          {
            text: 'Yes, delete!',
            handler: () => {
              this.deleteImage(index,data);
            }
          }
        ]
      });
      confirm.present();
    }
    
    
    numeric_Number(event: any) {
      const pattern = /[0-9]/;
      let inputChar = String.fromCharCode(event.charCode);
      if (event.keyCode != 8 && !pattern.test(inputChar)) {
        event.preventDefault();
      }
    }
  }
  