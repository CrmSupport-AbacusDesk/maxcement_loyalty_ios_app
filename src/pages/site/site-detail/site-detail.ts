import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { IonicPage, Loading, LoadingController, ModalController, NavController, NavParams } from 'ionic-angular';
import { ConstantProvider } from '../../../providers/constant/constant';
import { DbserviceProvider } from '../../../providers/dbservice/dbservice';
import { PurchaseAddPage } from '../../purchase/purchase-add/purchase-add';
import { PurchaseDetailPage } from '../../purchase/purchase-detail/purchase-detail';
import { SiteVisitAddPage } from '../../site-visit/site-visit-add/site-visit-add';
import { SiteVisitDetailPage } from '../../site-visit/site-visit-detail/site-visit-detail';
import { StatusModalPage } from '../../status-modal/status-modal';
import { ViewProfilePage } from '../../view-profile/view-profile';
import { SiteAddPage } from '../site-add/site-add';
import { SiteAddPageModule } from '../site-add/site-add.module';

/**
* Generated class for the SiteDetailPage page.
*
* See https://ionicframework.com/docs/components/#navigation for more info on
* Ionic pages and navigation.
*/

@IonicPage()
@Component({
  selector: 'page-site-detail',
  templateUrl: 'site-detail.html',
})
export class SiteDetailPage {
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
  clubAddress:any ={}
  
  
  constructor(public navCtrl: NavController, public navParams: NavParams, public loadingCtrl:LoadingController, public dbService:DbserviceProvider, public translate:TranslateService, public con:ConstantProvider, public modalCtrl:ModalController) {
    this.id = this.navParams.get('id');
    this.userType = navParams.data['user_type'];

    console.log(this.userType);
    
    
    console.log(dbService);
    this.presentLoading();
    this.siteDetail();
    this.purchaseList('');
    this.siteList('')
    this.uploadUrl = this.con.upload_url;
    
  }
  ngOnInit(){
    this.siteDetail();
  }
  
  ionviewwillenter(){
    this.siteDetail();

  }
  ionViewDidLoad() {
    this.siteDetail();
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
    
    
    this.dbService.post_rqst( { 'site_location_id': this.id}, 'app_karigar/siteLocationDetail').subscribe( r =>
      {
        this.loading.dismiss();
        this.getData = r.site_locations;
        this.user = r.site_locations.salesuser_id;
        this.selImages = r.site_locations.image;
        this.clubAddress = this.getData.address + ', ' + this.getData.district + ', ' + this.getData.state + ', ' + this.getData.site_owner_name + ', ' + this.getData.site_owner_contact
      });
      
    }
    checkin(){
      this.navCtrl.push(SiteVisitAddPage, {'id':this.id})
    }
    purchaseList(search){
      this.filter.limit = 0;
      this.filter.search=search;
      this.filter.pc_id = this.dbService.karigar_id;
      
      this.dbService.post_rqst( { 'filter': this.filter, 'site_location_id':this.id}, 'app_karigar/getSitePurchaseOrder').subscribe( r =>
        {
          console.log(r);
          this.loading.dismiss();
          
          this.data = r.purchase_orders;

          this.data.forEach(item => {
            if(item.verify_at == 'Dealer') item.user_type = 2;
            if(item.verify_at == 'SalesTeam') item.user_type = 3;
          });
          console.log(this.data);
          
          this.filter.mode = 1;
        });
        
      }
      
      
      doRefresh(refresher) 
      {
        this.siteDetail();
        this.purchaseList(''); 
        refresher.complete();
      }
      
      loadData(infiniteScroll)
      {
        console.log('loading');
        this.filter.limit=this.data.length;
        this.filter.pc_id = this.dbService.karigar_id;
        this.dbService.post_rqst({'filter' : this.filter, 'site_location_id':this.id},'app_karigar/purchaseList')
        .subscribe( (r) =>
        {
          console.log(r);
          if(r['categories']=='')
          {
            this.flag=1;
          }
          else
          {
            setTimeout(()=>{
              this.data=this.data.concat(r['purchase_orders']);
              infiniteScroll.complete();
            },1000);
          }
        });
      }
      
      
      viewProfiePic(id, name, type, add, date)
      {
        this.modalCtrl.create(ViewProfilePage, {"id": id,"Image": name, "type":type, 'address':add, 'date':date}).present();
      }
      
      editDetail()
      {
        
        this.getData.edit_profile= 'edit_profile';
        this.navCtrl.push(SiteAddPage, {'data':this.getData, 'user_type':this.userType});
      }
      
      purchaseDetail(id){
        this.navCtrl.push(PurchaseDetailPage, {'id':id, 'user_type':this.userType});
      }


      siteData:any =[]

      siteList(search){
        this.filter.limit = 0;
        this.filter.pc_id ='';
        this.filter.search=search;
        this.filter.site_location_id = this.id ;
        
        this.dbService.post_rqst( { 'filter': this.filter}, 'app_karigar/siteVisitList').subscribe( r =>
          {
            this.loading.dismiss();
            console.log(r);
            
            this.siteData = r.site_visit_remarks;
            console.log(this.data);
            
           
            // if(this.dbService.karigar_id != this.data.created_by && this.data.created_name != "Sales Executive"){
            //   console.log('test', );
              
            // }
            
            this.filter.mode = 1;
          });
          
        }


      loadData1(infiniteScroll)
      {
        console.log('loading');
        this.filter.pc_id ='';
        this.filter.limit=this.siteData.length;
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
              this.siteData=this.siteData.concat(r['site_visit_remarks']);
              console.log('Asyn operation has stop')
              infiniteScroll.complete();
            },1000);
          }
        });
      }

      goToDetail(id){
        this.navCtrl.push(SiteVisitDetailPage, {'id':id, 'user_type':this.userType});
      }
      
      addPurchase(){
        this.navCtrl.push(PurchaseAddPage,{'user_type':this.userType,'site_address':this.clubAddress, 'sales_zone':this.getData.sales_zone, 'site_location_id':this.getData.id,'detail':'siteDetails'})
      }


      openmodal(id, status) {
        let contactModal = this.modalCtrl.create(StatusModalPage,{'purchase_order_id':id, 'dealer_status':status, 'user_type':this.userType});
        
        
        contactModal.onDidDismiss(data => {
          console.log(data);
          this.siteList('');
        });
        contactModal.present();
      }
  
      
    }
    