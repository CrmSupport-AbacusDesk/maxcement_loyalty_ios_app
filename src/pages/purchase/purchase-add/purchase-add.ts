import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ActionSheetController, AlertController, IonicPage, Loading, LoadingController, NavController, NavParams, ToastController } from 'ionic-angular';
import { ConstantProvider } from '../../../providers/constant/constant';
import { DbserviceProvider } from '../../../providers/dbservice/dbservice';
import { PurchaseListPage } from '../purchase-list/purchase-list';

/**
* Generated class for the PurchaseAddPage page.
*
* See https://ionicframework.com/docs/components/#navigation for more info on
* Ionic pages and navigation.
*/

@IonicPage()
@Component({
  selector: 'page-purchase-add',
  templateUrl: 'purchase-add.html',
})
export class PurchaseAddPage {
  
  siteform: any = {};
  locations:any =[];
  products: any = [];
  dealers:any = [];
  pcs:any =[];
  
  citys: any = [];
  image = new FormData();
  salesUser:any =[];
  filter:any = {};
  flag:boolean=true;  
  saveFlag = false;
  id:any
  
  loading:Loading;
  userType:any ='';
  
  ok:any="";
  upl_file:any="";
  save_succ:any="";
  uploadUrl:any="";
  update_succ:any="";
  
  
  constructor(public navCtrl: NavController, public navParams: NavParams, public toastCtrl: ToastController, public dbService:DbserviceProvider, public loadingCtrl:LoadingController, public actionSheetController: ActionSheetController, public translate:TranslateService, public con:ConstantProvider, public alertCtrl: AlertController,) {
    this.uploadUrl = this.con.upload_url;
    this.userType = navParams.data['user_type'];
    
    this.siteList();
    this.getProducts();
    this.getPc();

    if(navParams.data.detail == 'siteDetails'){
      this.siteform = JSON.parse(JSON.stringify(navParams.data));
      this.siteform.site_location_id={};
      this.siteform.site_location_id['address']=navParams.data.site_address;
      this.siteform.site_location_id['id']=navParams.data.site_location_id;
      this.getDealer(this.siteform.sales_zone);
    }
    
    if(navParams.data.data){
      this.siteform = JSON.parse(JSON.stringify(navParams.data.data));
      this.siteform.purchase_order_id  = this.siteform.id;
      this.siteform.site_location_id={};
      this.siteform.site_location_id['address']=navParams.data.data.site_address;
      this.siteform.site_location_id['id']=navParams.data.data.site_location_id;
      this.siteform.dealer_id={};
      this.siteform.dealer_id['company_name']=navParams.data.data.dealer_name;
      this.siteform.dealer_id['id']=navParams.data.data.dealer_id;
      this.siteList()
      
      
      this.getDealer(this.siteform.sales_zone);
    }
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
  
  ionViewDidLoad() {
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
  
  
  
  
  // getAddress(){
  //   this.dbService.post_rqst({}, 'master/getSites')
  //   .subscribe(d => { 
  //     console.log(d);
  //     this.locations = d.site_locations;
  //   });
  // }
  
  siteList(){
    this.filter.limit = 0;
    this.filter.pc_id = this.dbService.karigar_id;
    this.dbService.post_rqst( { 'filter': this.filter}, 'app_karigar/getPCSites').subscribe( r =>
      {
        console.log(r);
        this.locations = r.site_locations;
      });
      return this.locations
    }
    getProducts(){
      this.dbService.post_rqst({}, 'master/getProducts')
      .subscribe(d => { 
        console.log(d);
        this.products = d.products;
      });
    }
    
    sale_zone:any ={};
    getDealer(zone){
      
      console.log(zone);
      
      if(this.navParams.data.data){
        this.sale_zone = zone 
      }
      else if (this.navParams.data.detail == 'siteDetails'){
        this.sale_zone = zone
      }
      else{
        this.sale_zone = zone.value.sales_zone;
      }
      
      this.dbService.post_rqst({'sales_zone':this.sale_zone}, 'master/getDealers')
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
    
    showAlert(text) {
      let alert = this.alertCtrl.create({
        title:'Alert!',
        cssClass:'action-close',
        subTitle: text,
        buttons: [{
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            this.siteform.qty = ''
          }
        },
        {
          text:'OK',
          cssClass: 'close-action-sheet',
          handler:()=>{
            this.siteform.qty = ''
          }
        }]
      });
      alert.present();
    }  
    content:any="";
    
    
    checkValue(value){
      if(value <= 0){
        this.translate.get("Quantity value is invaild")
        .subscribe(resp=>{
          this.content = resp;
        })
        this.showAlert(this.content);
        return
      }
    }
    
    submit(){
      
      if(this.userType == 1){
        this.siteform.pc_id = this.dbService.karigar_id;
        this.siteform.dealer_id =  this.siteform.dealer_id.id;
      }
      else if(this.userType == 2){
        this.siteform.dealer_id = this.dbService.karigar_id;
        this.siteform.pc_id =  this.siteform.pc_id.id;
      }

      else if(this.userType == 4){
        this.siteform.engineer_id = this.dbService.karigar_id;
        this.siteform.dealer_id =  this.siteform.dealer_id.id;
      }
      
      else{
        this.siteform.dealer_id = this.siteform.dealer_id.id;
        this.siteform.pc_id =  this.siteform.pc_id.id;
      }
      // this.siteform.pc_id =  this.siteform.pc_id.id;
      this.siteform.created_by = this.dbService.karigar_id;
      this.siteform.site_location_id = this.siteform.site_location_id.id;
      
      this.saveFlag = true;
      this.presentLoading();
      
      this.dbService.post_rqst( {'data':this.siteform},'app_karigar/addPurchaseOrder').subscribe( r =>
        {
          if(r['status'] == 'SUCCESS'){
            this.showUpdate(this.save_succ+"!");
            this.loading.dismiss();
            
            this.navCtrl.popTo(PurchaseListPage);
          }
          else if(r['status'] == 'UPDATED'){
            this.showUpdate(this.update_succ+"!");
            this.loading.dismiss();
            this.navCtrl.popTo(PurchaseListPage);
          }
        });
      }
      
      
      numeric_Number(event: any) {
        const pattern = /[0-9]/;
        let inputChar = String.fromCharCode(event.charCode);
        if (event.keyCode != 8 && !pattern.test(inputChar)) {
          event.preventDefault();
        }
      }
      
    }
    