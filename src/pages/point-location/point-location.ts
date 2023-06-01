import { Component, ViewChild ,ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams,AlertController,LoadingController, Navbar, Platform, Loading } from 'ionic-angular';
import { ToastController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { LocationAccuracy } from '@ionic-native/location-accuracy';
import { Geolocation,GeolocationOptions ,Geoposition ,PositionError } from '@ionic-native/geolocation';
import { DbserviceProvider } from '../../providers/dbservice/dbservice';
import { ProfilePage } from '../profile/profile';
import { TranslateService } from '@ngx-translate/core';

/**
* Generated class for the PointLocationPage page.
*
* See https://ionicframework.com/docs/components/#navigation for more info on
* Ionic pages and navigation.
*/

declare var google;
@IonicPage()
@Component({
  selector: 'page-point-location',
  templateUrl: 'point-location.html',
})
export class PointLocationPage {
  
  data:any = {};
  checkExist=false;
  options : GeolocationOptions;
  currentPos : Geoposition;
  type:any;
  @ViewChild('map') mapElement: ElementRef;
  map: any;
  loading:Loading;
  longitude:any;
  latitude:any;
  
  constructor(public navCtrl: NavController, public translate:TranslateService, public navParams: NavParams,public service: DbserviceProvider,public loadingCtrl: LoadingController,private alertCtrl: AlertController,public toastCtrl: ToastController,public storage:Storage,public locationAccuracy: LocationAccuracy,public geolocation: Geolocation ) {
    this.options = {
      enableHighAccuracy : true
    };
    
    this.geolocation.getCurrentPosition(this.options).then((pos : Geoposition) => {
      
      this.currentPos = pos;      
      console.log(pos, 'line number 137');
      this.addMap(pos.coords.latitude,pos.coords.longitude);
    },(err : PositionError)=>{
      console.log("error : " + err.message);
    });
  }
  
  ionViewWillEnter(){
    // this.getUserPosition();
  }
  ionViewDidLoad() {
    // this.presentLoading();
    
  }

  showSuccess(text)
  {
    let alert = this.alertCtrl.create({
      title:'Success!',
      subTitle: text,
      buttons: ['OK']
    });
    alert.present();
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
  
  
  
  
  presentToast() {
    let toast = this.toastCtrl.create({
      message: 'Location Updated Successfully',
      duration: 3000,
      position: 'bottom'
    });
    
    
    
    toast.present();
  }
  
  
  
  pointlocation(){
    this.locationAccuracy.request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY)
    .then(() => {
      let options = {
        maximumAge: 10000, timeout: 15000, enableHighAccuracy: true
      };
      this.geolocation.getCurrentPosition(options)
      .then((resp) => {
        console.log('response geolocation', resp);
        this.latitude = resp.coords.latitude;
        this.longitude = resp.coords.longitude;
        console.log(this.latitude, 'latitude line number 100');
        console.log(this.longitude, 'longitude line number 100');

        
        this.loactionUpdate();
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
  
  
  loactionUpdate(){
    let alert=this.alertCtrl.create({
      title:'Confirmation!',
      subTitle: 'Do you want to add location',
      cssClass:'action-close',

      buttons: [{
        text: 'No',
        role: 'cancel',
        handler: () => {
          console.log('Cancel clicked');
        }
      },
      {
        text:'Yes',
        cssClass: 'close-action-sheet',
        handler:()=>
        {
          this.service.post_rqst( {'dealer_lat':this.latitude, 'dealer_long':this.longitude, 'dealer_id': this.service.karigar_id},'app_karigar/update_dealer_location').subscribe( result =>
            {
              console.log(result);
              if(result.status == 'sucess'){
                this.showSuccess("Location Added Successfully!");
                this.navCtrl.popTo(ProfilePage)
              }
            });
          }
        }]
      });
      alert.present();
   

  
    
  }
  
  // getUserPosition(){
  
  // }
  
  addMap(lat,long){
    
    let latLng = new google.maps.LatLng(lat, long);
    let mapOptions = {
      center: latLng,
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    }
    this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
    this.addMarker();
  }
  
  addMarker(){
    console.log(this.data);
    
    let marker = new google.maps.Marker({
      map: this.map,
      animation: google.maps.Animation.DROP,
      position: this.map.getCenter()
    });
    console.log(this.map);
    
    let content = "<p>This is your current position !</p>";          
    let infoWindow = new google.maps.InfoWindow({
      content: content
    });
    
    google.maps.event.addListener(marker, 'click', () => {
      infoWindow.open(this.map, marker);
    });
    
  }
  
  
}