import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AlertController, IonicPage, Loading, LoadingController, NavController, NavParams, ViewController } from 'ionic-angular';
import { DbserviceProvider } from '../../providers/dbservice/dbservice';
import { SiteListPage } from '../site/site-list/site-list';

/**
* Generated class for the StatusModalPage page.
*
* See https://ionicframework.com/docs/components/#navigation for more info on
* Ionic pages and navigation.
*/

@IonicPage()
@Component({
  selector: 'page-status-modal',
  templateUrl: 'status-modal.html',
})
export class StatusModalPage {
  statusform: any = {};
  saveFlag = false;
  purchase_order_id:any =''
  
  ok:any="";
  upl_file:any="";
  save_succ:any="";
  uploadUrl:any="";
  update_succ:any="";
  userType:any ='';
  loading:Loading;
  
  constructor(public navCtrl: NavController, public navParams: NavParams, public dbService:DbserviceProvider, public loadingCtrl:LoadingController,public translate:TranslateService, public alertCtrl: AlertController, public viewCtrl: ViewController) {
    this.purchase_order_id = navParams.data.purchase_order_id;
    this.statusform.dealer_status = navParams.data.dealer_status;
    // this.statusform.company_status = navParams.data.dealer_status;
    
    this.userType =navParams.data.user_type 
  }
  
  ionViewDidLoad() {
    
    
    this.translate.get("OK")
    .subscribe(resp=>{
      this.ok = resp
    });
    
    this.translate.get("Status Change Successfully")
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
  
  
  dismiss() {
    this.viewCtrl.dismiss();
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
  
  
  submit(){
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
            this.statusform.purchase_order_id = this.purchase_order_id;
            this.presentLoading();
            this.saveFlag = true;
            this.dbService.post_rqst( {'data':this.statusform},'app_karigar/purchaseOrderDealerStatus').subscribe( r =>
              {
                if(r['Status'] == 'UPDATED'){
                  this.showUpdate(this.save_succ+"!");
                  // this.viewCtrl.dismiss();
                  this.navCtrl.popTo(SiteListPage);
                  this.loading.dismiss();
                }
                
              });
              
            }
          }
        ]
      });
      confirm.present();
      
    }
    
  }
  