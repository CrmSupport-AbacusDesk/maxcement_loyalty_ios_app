import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { IonicPage, Loading, LoadingController, NavController, NavParams } from 'ionic-angular';
import { DbserviceProvider } from '../../../providers/dbservice/dbservice';
import { SiteAddPage } from '../site-add/site-add';
import { SiteDetailPage } from '../site-detail/site-detail';

/**
* Generated class for the SiteListPage page.
*
* See https://ionicframework.com/docs/components/#navigation for more info on
* Ionic pages and navigation.
*/

@IonicPage()
@Component({
  selector: 'page-site-list',
  templateUrl: 'site-list.html',
})
export class SiteListPage {
  loading:Loading;
  filter:any = {};
  flag:any='';
  data:any =[];
  userType:any ="";
  details: string = "My";
  teamExist:any;
  active_count:any =0;
  inactive_count:any =0;
  sites: string = "Active";
  checkInFlag:any;
  
  
  constructor(public navCtrl: NavController, public navParams: NavParams, public dbService:DbserviceProvider, public translate:TranslateService, public loadingCtrl:LoadingController) {
    this.checkInFlag = true;
  
    this.userType = navParams.data['user_type'];
    this.teamExist = navParams.data['team_exist'];
    this.checkInFlag = this.navParams.data['flag'];
    this.presentLoading();
    if (this.userType != 3){
      this.details = '';
    }
    this.siteList('', this.details, this.sites); 
  }
  
  ionViewDidLoad() {
    // this.userType = this.dbService.karigar_info;
  }
  ionViewWillEnter(){
    this.siteList('', this.details, this.sites); 
  }
  
  doRefresh(refresher) 
  {
    this.siteList('', this.details, this.sites); 
    refresher.complete();
  }
  
  
  goOnSiteAdd(){
    this.navCtrl.push(SiteAddPage,{'user_type':this.userType})
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
  
  siteList(search, details, site_status){
    this.filter.limit = 0;
    this.filter.search=search;
    this.filter.site_type=details;
    this.filter.pc_id = this.dbService.karigar_id;
    this.filter.site_status = site_status;
    
    
    this.dbService.post_rqst( { 'filter': this.filter}, 'app_karigar/siteLocationList').subscribe( r =>
      {
        this.loading.dismiss();
        console.log(r);
        
        this.active_count = r.active_count;
        this.inactive_count = r.inactive_count;
        
        this.data = r.site_locations;
        console.log(this.data);
        this.flag = this.data.flag;
        console.log(this.flag);
        

        // if(this.dbService.karigar_id != this.data.created_by && this.data.created_name != "Sales Executive"){
        //   console.log('test', );
        
        // }
        
        this.filter.mode = 1;
      });
      
    }
    
    loadData(infiniteScroll)
    {
      console.log('loading');
      this.filter.limit=this.data.length;
      this.dbService.post_rqst({'filter' : this.filter},'app_karigar/siteLocationList')
      .subscribe( (r) =>
      {
        console.log(r);
        if(r['site_locations']=='')
        {
          this.flag=1;
        }
        else
        {
          setTimeout(()=>{
            this.data=this.data.concat(r['site_locations']);
            console.log('Asyn operation has stop')
            infiniteScroll.complete();
          },1000);
        }
      });
    }
    
    goOnSiteDetail(id){
      this.navCtrl.push(SiteDetailPage, {'id':id, 'user_type':this.userType});
    }
    
  }
  