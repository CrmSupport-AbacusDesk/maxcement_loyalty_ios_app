import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AlertController, IonicPage, Loading, LoadingController, ModalController, NavController, NavParams, ToastController } from 'ionic-angular';
import { DbserviceProvider } from '../../../providers/dbservice/dbservice';
import { StatusModalPage } from '../../status-modal/status-modal';
import { PurchaseAddPage } from '../purchase-add/purchase-add';
import { PurchaseDetailPage } from '../purchase-detail/purchase-detail';

/**
* Generated class for the PurchaseListPage page.
*
* See https://ionicframework.com/docs/components/#navigation for more info on
* Ionic pages and navigation.
*/

@IonicPage()
@Component({
  selector: 'page-purchase-list',
  templateUrl: 'purchase-list.html',
})
export class PurchaseListPage {
  loading:Loading;
  filter:any = {};
  flag:any='';
  data:any =[];
  details: string = "Pending";
  types: string = "My";
  teamExist:any;
  userType:any;
  new_dealer_status:any ={}
  
  constructor(public navCtrl: NavController, public toastCtrl: ToastController, public alertCtrl: AlertController, public navParams: NavParams, public dbService:DbserviceProvider, public translate:TranslateService, public modalCtrl:ModalController, public loadingCtrl:LoadingController) {
    this.userType = navParams.data['user_type'];
    this.teamExist = navParams.data['team_exist'];
    this.purchaseList('', this.types, this.details);
    if (this.userType != 3){
      this.types = '';
    }
    this.presentLoading();
  }
  
  ionViewDidLoad() {
    this.purchaseList('', this.types, this.details);
    
    this.translate.get("OK")
    .subscribe(resp=>{
      this.ok = resp
    });
    
    this.translate.get("Upload File")
    .subscribe(resp=>{
      this.upl_file = resp
    });
    
    this.translate.get("Status Changed successfully")
    .subscribe(resp=>{
      this.save_succ = resp
    });
    
  }
  
  ionviewwillenter(){
    this.purchaseList('', this.types, this.details);
    this.presentLoading();
  }
  
  
  addPurchase(){
    this.navCtrl.push(PurchaseAddPage,{'user_type':this.userType})
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
  
  
  doRefresh(refresher) 
  {
    this.purchaseList('', this.types, this.details); 
    refresher.complete();
  }
  
  pending_count:any =0;
  rejected_count:any =0;
  verified_count:any =0;
  
  purchaseList(search, types, site_status){
    this.filter.limit = 0;
    this.filter.search=search;
    this.filter.status=site_status;
    this.filter.purchase_type=types;
    
    this.filter.pc_id = this.dbService.karigar_id;
    this.dbService.post_rqst( { 'filter': this.filter}, 'app_karigar/purchaseList').subscribe( r =>
      {
        console.log(r);
        this.loading.dismiss();
        
        this.data = r.purchase_orders;
        this.data.forEach(item => {
          if(item.verify_at == 'Dealer') item.user_type = 2;
          if(item.verify_at == 'SalesTeam') item.user_type = 3;
        });
        this.pending_count = r.pending_count;
        this.rejected_count = r.rejected_count;
        this.verified_count = r.verified_count;
        console.log(this.data);
        
        this.filter.mode = 1;
      });
      
    }
    
    loadData(infiniteScroll)
    {
      this.filter.limit=this.data.length;
      this.dbService.post_rqst({'filter' : this.filter},'app_karigar/purchaseList')
      .subscribe( (r) =>
      {
        console.log(r);
        if(r['purchase_orders']=='')
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
    
    
    statusform: any = {};
    saveFlag :boolean = false;
    ok:any="";
    upl_file:any="";
    save_succ:any="";
    
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
    
    
    presentToast(text) {
      const toast = this.toastCtrl.create({
        message: text,
        duration: 3000
      });
      toast.present();
    }
    
    updateStatus(id, status, reason){
      
      if(!status){
        this.presentToast('Please select status');
        return;
      }
      
      else if (status == 'Reject' && !reason){
        this.presentToast('Reason field is required');
        return;
      }
      else{
        const confirm = this.alertCtrl.create({
          title: 'Are you sure?',
          message: 'You want to change status!',
          buttons: [
            {
              text: 'No',
              handler: () => {
              }
            },
            {
              text: 'Yes',
              handler: () => {
                this.statusform.updated_by = this.dbService.karigar_id;
                this.statusform.purchase_order_id = id;
                this.statusform.dealer_status = status;
                this.statusform.reason = reason;
                this.presentLoading();
                this.saveFlag = true;
                this.dbService.post_rqst( {'data':this.statusform},'app_karigar/purchaseOrderDealerStatus').subscribe( r =>
                  {
                    if(r['Status'] == 'UPDATED'){
                      this.showUpdate(this.save_succ+"!");
                      // this.viewCtrl.dismiss();
                      this.saveFlag = false;
                      this.loading.dismiss();
                      this.purchaseList('', this.types, this.details); 
                    }
                  });
                  
                }
              }
            ]
          });
          confirm.present();
        }
        
        
        
      }
      
      
      openmodal(id, status) {
        let contactModal = this.modalCtrl.create(StatusModalPage,{'purchase_order_id':id, 'dealer_status':status, 'user_type':this.userType});
        
        
        contactModal.onDidDismiss(data => {
          console.log(data);
          this.purchaseList('', this.types, this.details);
        });
        contactModal.present();
      }
      
      purchaseDetail(id){
        this.navCtrl.push(PurchaseDetailPage, {'id':id, 'user_type':this.userType});
      }
      
    }
    