import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { IonicPage, Loading, LoadingController, ModalController, NavController, NavParams } from 'ionic-angular';
import { ConstantProvider } from '../../../providers/constant/constant';
import { DbserviceProvider } from '../../../providers/dbservice/dbservice';
import { ViewProfilePage } from '../../view-profile/view-profile';
import { DomSanitizer } from '@angular/platform-browser';
/**
* Generated class for the SiteVisitDetailPage page.
*
* See https://ionicframework.com/docs/components/#navigation for more info on
* Ionic pages and navigation.
*/

@IonicPage()
@Component({
  selector: 'page-site-visit-detail',
  templateUrl: 'site-visit-detail.html',
})
export class SiteVisitDetailPage {
  id:any
  getData:any = {};
  user:any = [];
  selImages=[];
  uploadUrl:any="";
  loading:Loading;
  details: string = "basic";
  filter:any = {};
  data:any =[];
  flag:any='';
  userType:any ='';
  GoogleAddress:any;
  url:any;
  
  
  constructor(public navCtrl: NavController, private sanitize: DomSanitizer, public navParams: NavParams, public loadingCtrl:LoadingController, public dbService:DbserviceProvider, public translate:TranslateService, public con:ConstantProvider, public modalCtrl:ModalController) {
    this.id = this.navParams.get('id');
    this.userType = navParams.data['user_type'];
    console.log(dbService);
    this.presentLoading();
    this.siteDetail();
    this.uploadUrl = this.con.upload_url;
    
  }
  
  ionViewDidLoad() {
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
  
  siteDetail(){
    
    this.filter.site_location_id = this.id
    this.dbService.post_rqst( { 'filter':this.filter, 'site_location_id':this.id}, 'app_karigar/siteVisitDetail').subscribe( r =>
      {
        console.log(r);
        
        this.loading.dismiss();
        this.getData = r.site_visit_remark;
        this.selImages = r.site_visit_remark.visit_images;

        this.GoogleAddress = "https://maps.google.com/maps?q="+ this.getData.site_lat+','+this.getData.site_long +"&output=embed"        
        this.url = this.sanitize.bypassSecurityTrustResourceUrl(this.GoogleAddress);

        console.log(this.selImages);
        
        console.log(r);
      });
      
    }
    
    viewProfiePic(id, name, type, add, date)
    {
      this.modalCtrl.create(ViewProfilePage, {"id": id,"Image": name, "type":type, 'address':add, 'date':date}).present();
    }
    
    doRefresh(refresher) 
    {
      this.siteDetail();
      refresher.complete();
    }
    
  }
  