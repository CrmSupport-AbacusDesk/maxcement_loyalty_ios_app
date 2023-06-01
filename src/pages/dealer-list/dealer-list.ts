import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { IonicPage, Loading, LoadingController, NavController, NavParams } from 'ionic-angular';
import { DbserviceProvider } from '../../providers/dbservice/dbservice';
import { UserAddPage } from '../user-add/user-add';
import { UserDetailPage } from '../user-detail/user-detail';

/**
 * Generated class for the DealerListPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-dealer-list',
  templateUrl: 'dealer-list.html',
})
export class DealerListPage {
  loading:Loading;
  filter:any = {};
  flag:any='';
  pcData:any =[];
  details: string = "Pending";
  userType:any;
  zone:any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public dbService:DbserviceProvider, public translate:TranslateService, public loadingCtrl:LoadingController) {
    this.presentLoading();
    this.getZone();
  
  }
  
  ionViewDidLoad() {
    console.log('ionViewDidLoad pcListPage');
  }
 
  ionviewwillenter(){
   
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

  getZone(){
    this.dbService.post_rqst( {'karigar_id':this.dbService.karigar_id}, 'app_karigar/karigarZone').subscribe( r =>
      {
        console.log(r);
        this.zone = r.karigar.sales_zone;
        this.dealerList('', this.details);
      });
    }
  
  
  doRefresh(refresher, status) 
  {
    this.dealerList('',this.details); 
    refresher.complete();
  }
  pending_count:any =0;
  rejected_count:any =0;
  verified_count:any =0;

  
  dealerList(search, status){

    this.filter.limit = 0;
    this.filter.search=search;
    this.filter.status=status;
    this.filter.pc_id = this.dbService.karigar_id;
    this.filter.sales_zone=this.zone;

    this.dbService.post_rqst( { 'filter': this.filter}, 'app_karigar/getSalesUserDealer').subscribe( r =>
      {
        console.log(r);
        this.loading.dismiss();
        this.pcData = r.data;
        this.pending_count = r.pending_count;
        this.rejected_count = r.rejected_count;
        this.verified_count = r.verified_count;


        console.log(this.pcData);
        
        this.filter.mode = 1;
      });
      
    }
    
    loadData(infiniteScroll)
    {
      this.filter.limit=this.pcData.length;
      this.dbService.post_rqst({'filter' : this.filter, 'sales_zone':this.zone},'app_karigar/getSalesUserDealer')
      .subscribe( (r) =>
      {
        console.log(r);
        if(r['data']=='')
        {
          this.flag=1;
        }
        else
        {
          setTimeout(()=>{
            this.pcData=this.pcData.concat(r['data']);
            infiniteScroll.complete();
          },1000);
        }
      });
    }


  addDealer(){
    this.navCtrl.push(UserAddPage, {'user_type':'Dealer'})
  }
  Detail(id){
    this.navCtrl.push(UserDetailPage, {'user_type':'Dealer', 'id':id})
  }

}
