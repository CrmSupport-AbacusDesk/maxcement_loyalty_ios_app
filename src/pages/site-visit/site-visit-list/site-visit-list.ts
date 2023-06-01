import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { IonicPage, Loading, LoadingController, NavController, NavParams } from 'ionic-angular';
import { DbserviceProvider } from '../../../providers/dbservice/dbservice';
import { SiteListPage } from '../../site/site-list/site-list';
import { SiteVisitAddPage } from '../site-visit-add/site-visit-add';
import { SiteVisitDetailPage } from '../site-visit-detail/site-visit-detail';

/**
 * Generated class for the SiteVisitListPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-site-visit-list',
  templateUrl: 'site-visit-list.html',
})
export class SiteVisitListPage {
  loading:Loading;
  filter:any = {};
  flag:any='';
  data:any =[];
  userType:any ="";
  teamExist:any;
  checkInFlag: any =false;

  
  constructor(public navCtrl: NavController, public navParams: NavParams, public dbService:DbserviceProvider, public translate:TranslateService, public loadingCtrl:LoadingController) {
    this.userType = navParams.data['user_type'];
    this.teamExist = navParams.data['team_exist'];

    console.log(this.userType);
    
    this.presentLoading();
    this.siteList(''); 
    console.log(dbService);
    
  }
  
  ionViewDidLoad() {
    // this.userType = this.dbService.karigar_info;
  }
  ionViewWillEnter(){
  }
  
  doRefresh(refresher) 
  {
    this.siteList(''); 
    refresher.complete();
  }
  
  
  goOnSiteVisit(){
    this.navCtrl.push(SiteListPage, {"user_type":this.userType, "team_exist":this.teamExist, 'flag':this.checkInFlag})
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
  
  siteList(search){
    this.filter.limit = 0;
    this.filter.search=search;
    this.filter.pc_id = this.dbService.karigar_id;
    
    this.dbService.post_rqst( { 'filter': this.filter}, 'app_karigar/siteVisitList').subscribe( r =>
      {
        this.loading.dismiss();
        console.log(r);
        
        this.data = r.site_visit_remarks;
        console.log(this.data);
        
       
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
      this.dbService.post_rqst({'filter' : this.filter},'app_karigar/siteVisitList')
      .subscribe( (r) =>
      {
        console.log(r);
        if(r['site_visit_remarks']=='')
        {
          this.flag=1;
        }
        else
        {
          setTimeout(()=>{
            this.data=this.data.concat(r['site_visit_remarks']);
            console.log('Asyn operation has stop')
            infiniteScroll.complete();
          },1000);
        }
      });
    }


    goToDetail(id){
      this.navCtrl.push(SiteVisitDetailPage, {'id':id, 'user_type':this.userType});
    }
  }