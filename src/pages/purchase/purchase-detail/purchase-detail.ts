import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { IonicPage, Loading, LoadingController, ModalController, NavController, NavParams } from 'ionic-angular';
import { ConstantProvider } from '../../../providers/constant/constant';
import { DbserviceProvider } from '../../../providers/dbservice/dbservice';
import { StatusModalPage } from '../../status-modal/status-modal';
import { PurchaseAddPage } from '../purchase-add/purchase-add';

/**
* Generated class for the PurchaseDetailPage page.
*
* See https://ionicframework.com/docs/components/#navigation for more info on
* Ionic pages and navigation.
*/

@IonicPage()
@Component({
  selector: 'page-purchase-detail',
  templateUrl: 'purchase-detail.html',
})
export class PurchaseDetailPage {
  id:any
  getData:any = {};
  user:any = [];
  selImages=[];
  uploadUrl:any="";
  loading:Loading;
  userType:any ="";
  
  constructor(public navCtrl: NavController, public navParams: NavParams, public loadingCtrl:LoadingController, public dbService:DbserviceProvider, public translate:TranslateService, public con:ConstantProvider, public modalCtrl:ModalController) {
    this.id = this.navParams.get('id');
    this.userType = navParams.data['user_type'];
    this.presentLoading();
    this.siteDetail();
    this.uploadUrl = this.con.upload_url;
    
  }
  
  ionViewDidLoad() {
    console.log('ionViewDidLoad SiteDetailPage');
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
    
    
    this.dbService.post_rqst( { 'purchase_id': this.id, 'karigar_id': this.dbService.karigar_id}, 'app_karigar/purchaseDetail').subscribe( r =>
      {
        this.loading.dismiss();
        this.getData = r.purchase_order;
        this.user = r.purchase_order.sales_executive
      });
      
    }
    
    
    openmodal() {
      let contactModal = this.modalCtrl.create(StatusModalPage,{'purchase_order_id':this.id, 'dealer_status':this.getData.dealer_status, 'user_type':this.userType});
      

      contactModal.onDidDismiss(data => {
        console.log(data);
        this.siteDetail();
      });
      contactModal.present();
    }
    
    doRefresh(refresher) 
    {
      this.siteDetail(); 
      refresher.complete();
    }
    
    editDetail()
    {
      
      this.getData.edit_profile= 'edit_profile';
      this.navCtrl.push(PurchaseAddPage, {'data':this.getData, 'user_type':this.userType});
    }
  }
  