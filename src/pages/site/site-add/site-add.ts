import { Component, ViewChild } from '@angular/core';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { TranslateService } from '@ngx-translate/core';
import { ActionSheetController, AlertController, Content, IonicPage, Loading, LoadingController, NavController, NavParams, ToastController } from 'ionic-angular';
import { ConstantProvider } from '../../../providers/constant/constant';
import { DbserviceProvider } from '../../../providers/dbservice/dbservice';
import { SiteListPage } from '../site-list/site-list';
import { Geolocation } from '@ionic-native/geolocation';
import { LocationAccuracy } from '@ionic-native/location-accuracy';
/**
* Generated class for the SiteAddPage page.
*
* See https://ionicframework.com/docs/components/#navigation for more info on
* Ionic pages and navigation.
*/

@IonicPage()
@Component({
  selector: 'page-site-add',
  templateUrl: 'site-add.html',
})
export class SiteAddPage {
  @ViewChild(Content) content: Content;
  
  siteform: any = {};
  states:any =[];
  districts: any = [];
  citys: any = [];
  image = new FormData();
  salesUser:any =[];
  filter:any = {};
  flag:boolean=true;  
  saveFlag = false;
  id:any
  dealers:any =[];
  
  loading:Loading;
  pcs:any =[];
  engineer:any =[];
  cam:any="";
  gal:any="";
  cancl:any="";
  ok:any="";
  upl_file:any="";
  save_succ:any="";
  uploadUrl:any="";
  update_succ:any="";
  userType:any ="";
  lat:any='';
  long:any='';
  
  constructor(private geolocation: Geolocation, public locationaccuracy: LocationAccuracy,public navCtrl: NavController, public navParams: NavParams, public toastCtrl: ToastController, public dbService:DbserviceProvider, public loadingCtrl:LoadingController, public actionSheetController: ActionSheetController, public translate:TranslateService, private camera: Camera, public con:ConstantProvider, public alertCtrl: AlertController,) {
    // this.dbService.karigar_id;
    
    
    
    this.userType = navParams.data['user_type'];
    this.uploadUrl = this.con.upload_url;
    this.getStateList();
    this.getBrand();
    this.getPc();
    this.getEngineer();
   
    
    if(navParams.data.data){
      console.log(navParams.data.data);
      
      this.siteform = navParams.data.data;
      this.siteform.city
      this.siteform = JSON.parse(JSON.stringify(navParams.data.data));
      this.siteform.state={};
      this.siteform.state['state_name']=navParams.data.data.state;
      
      
      
      this.siteform.pc_id={};
      this.siteform.pc_id['first_name']=navParams.data.data.pc_name;
      this.siteform.pc_id['id']=navParams.data.data.pc_id;


      this.siteform.engineer_id={};
      this.siteform.engineer_id['first_name']=navParams.data.data.engineer_name;
      this.siteform.engineer_id['id']=navParams.data.data.engineer_id;


      
      
      
      this.siteform.brand ={};
      this.siteform.brand['brand_name']=navParams.data.data.brand;
      
      this.siteform.district={};
      this.siteform.district['district_name']=navParams.data.data.district;
      
      this.siteform.city={};
      
      this.siteform.city['city_name']=navParams.data.data.city
      
      this.getDistrictList(this.siteform.state['state_name']);
      this.getCityList(this.siteform.district['district_name']);
      this.siteform.dealer_id={};
      this.siteform.dealer_id['company_name']=navParams.data.data.dealer_name;
      this.siteform.dealer_id['id']=navParams.data.data.dealer_id;
      
      
      this.getZoneList(this.siteform.city['city_name']);
      
      
      this.getSalesUser();
      this.siteform.site_location_id  = this.siteform.id;
      this.getDealer(this.siteform.sales_zone)
      for(let i=0; i<this.siteform.image.length ;i++)
      {
        // if( parseInt( this.siteform.images[i].profile ) == 1  )
        this.selImages.push({"image":this.siteform.image[i].image_name,"id":this.siteform.image[i].id} );
      }
      console.log(this.selImages);
      
    }
    
    console.log(navParams);
    
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
  
  dataToggle(data){
    if(data == 'PC'){
        this.siteform.engineer_id = '';
    }
    else{
      this.siteform.pc_id = '';
    }
  }


  brandData:any =[]
  getBrand(){
    this.dbService.post_rqst({}, 'app_master/getBrandsForSites')
    .subscribe(d => { 
      console.log(d);
      
      // this.loading_list = false;  
      this.brandData = d.brands;
      console.log(this.brandData);
      
    });
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
    
    this.translate.get("Save Successfully")
    .subscribe(resp=>{
      this.save_succ = resp
    });
    
    this.translate.get("Updated Successfully")
    .subscribe(resp=>{
      this.update_succ = resp
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
  
  
  getStateList(){
    this.dbService.post_rqst({}, 'master/getLocationStates')
    .subscribe(d => { 
      this.states = d.locationStates;
    });
  }
  
  getDistrictList(state_name){
    console.log(state_name);
    
    this.dbService.post_rqst({'state_name':state_name}, 'master/getLocationDistricts')
    .subscribe(d => { 
      
      this.districts = d.locationDistricts;
    });
  }
  
  getCityList(district){
    this.dbService.post_rqst({'district_name':district}, 'master/getLocationCitys')
    .subscribe(d => { 
      
      this.citys = d.locationCitys;
    });
  }
  
  getZoneList(city){
    this.dbService.post_rqst({'city_name':city}, 'master/getLocationZones')
    .subscribe(d => { 
      console.log(d);
      this.siteform.sales_zone = d.locationZones.zone;
      this.getSalesUser();
      this.getDealer(this.siteform.sales_zone);
    });
  }
  
  getSalesUser(){
    this.filter.assigned_location = this.siteform.sales_zone;
    this.dbService.post_rqst({'filter':this.filter}, 'karigar/getSalesExecutives')
    .subscribe(d => { 
      console.log(d);
      this.siteform.assign_to = d.assign_to;
      this.salesUser = d.sales_executives;
      console.log( this.siteform.assign_to);
      
    });
  }
  
  getDealer(zone){
    this.dbService.post_rqst({'sales_zone':zone}, 'master/getDealers')
    .subscribe(d => { 
      this.dealers = d.dealers;
    });
  }
  
  getPc(){
    this.dbService.post_rqst({}, 'master/getPCs')
    .subscribe(d => { 
      this.pcs = d.pcs;
    });
  }

  getEngineer(){
    this.dbService.post_rqst({}, 'master/get_engineer')
    .subscribe(d => { 
      this.engineer =d.engineer
      // this.pcs = d.pcs;
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
  
  this.locationaccuracy.request(this.locationaccuracy.REQUEST_PRIORITY_HIGH_ACCURACY)
  .then(() => {
    let options = {
      maximumAge: 10000, timeout: 15000, enableHighAccuracy: true
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
      
      console.log(options);
      this.camera.getPicture(options).then((imageData) => {        
        this.flag=false;
        this.siteform.image = 'data:image/jpeg;base64,' + imageData;
        this.selImages.push({"image":this.siteform.image, 'site_image_lat':this.lat,  'site_image_long':this.long});
        this.siteform.images = this.selImages;
        console.log(this.siteform, 'line number 309');
        
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
  
  
  if(this.userType == 1){
    this.siteform.pc_id = this.dbService.karigar_id;
    this.siteform.dealer_id = this.siteform.dealer_id.id;
    this.siteform.engineer_id ='';
    this.siteform.site_user_type ='PC';

  }
  else if(this.userType == 2){
    this.siteform.dealer_id = this.dbService.karigar_id;
    this.siteform.pc_id = this.siteform.pc_id.id;
    this.siteform.engineer_id = this.siteform.engineer_id.id;
  }

  else if(this.userType == 4){
    this.siteform.engineer_id = this.dbService.karigar_id;
    this.siteform.dealer_id = this.siteform.dealer_id.id;
    this.siteform.pc_id ='';
    this.siteform.site_user_type ='Engineer';

  }
  else{
    
    this.siteform.pc_id = this.siteform.pc_id.id;
    this.siteform.engineer_id = this.siteform.engineer_id.id;
    this.siteform.dealer_id = this.siteform.dealer_id.id;
    this.siteform.salesuser_id = [{"id":this.dbService.karigar_id}]
  }
  
  
  
  // if(this.selImages.length <= 0){
  //   this.presentToast('Please upload atleast one picture');
  //   return
  // }
  
  
  
  
  
  this.siteform.created_by = this.dbService.karigar_id;
  this.siteform.state = this.siteform.state.state_name;
  this.siteform.district = this.siteform.district.district_name;
  this.siteform.city = this.siteform.city.city_name;
  this.siteform.brand = this.siteform.brand.brand_name;
  this.siteform.lat = this.lat;
  this.siteform.long = this.long;
  
  this.saveFlag = true;
  this.presentLoading();
  this.dbService.post_rqst( {'data':this.siteform},'app_karigar/siteLocationAdd ').subscribe( r =>
    {
      if(r['status'] == 'SUCCESS'){
        this.loading.dismiss();
        this.showUpdate(this.save_succ+"!");
        this.navCtrl.popTo(SiteListPage);
      }
      else if(r['status'] == 'UPDATED'){
        this.loading.dismiss();
        this.showUpdate(this.update_succ+"!");
        this.navCtrl.popTo(SiteListPage);
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
