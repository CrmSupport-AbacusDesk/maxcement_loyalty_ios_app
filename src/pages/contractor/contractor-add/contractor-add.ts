import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { IonicPage, Loading, LoadingController, NavController, NavParams, ToastController } from 'ionic-angular';
import { DbserviceProvider } from '../../../providers/dbservice/dbservice';
import { ContractorListPage } from '../contractor-list/contractor-list';

/**
* Generated class for the ContractorAddPage page.
*
* See https://ionicframework.com/docs/components/#navigation for more info on
* Ionic pages and navigation.
*/

@IonicPage()
@Component({
  selector: 'page-contractor-add',
  templateUrl: 'contractor-add.html',
})
export class ContractorAddPage {
  
  conData:any={};
  conData1:any={};
  today_date:any ={};
  todayDate:any
  contractorData:any =[];
  loading:Loading;
  
  constructor(public navCtrl: NavController, public navParams: NavParams, public toastCtrl: ToastController, public dbService:DbserviceProvider, public loadingCtrl:LoadingController, public translate:TranslateService) {
    // this.dbService.karigar_id;
  }
  
  ionViewDidLoad() {
    this.getCategory();
  }
  
  presentToast() {
    const toast = this.toastCtrl.create({
      message: 'Delete successfully',
      duration: 3000
    });
    toast.present();
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
  
  category:any=[];
  getCategory()
  {
    this.dbService.get_rqst('app_karigar/getCategory')
    .subscribe(d => {
      console.log(d);
      this.category = d.category;
      console.log(this.category);
    });
  }
  
  product_code:any =[]
  
  getProduct(val){
    let id
    id = val.id
    this.conData1.category_name = val.category_name;
    this.dbService.post_rqst( {'subcategory':id}, 'app_karigar/getProduct?page=').subscribe(r=>{
      console.log(r);
      this.product_code=r['productData'];
      console.log(this.product_code);
    })
  }
  
  
  product_size:any =[]
  
  getSize(val){
    let id
    id = val.id;
    this.conData1.product_name = val.product_name;
    this.dbService.post_rqst( {'product_id':id}, 'app_karigar/coupon_product_size?page=').subscribe(r=>{
      console.log(r);
      this.product_size=r['product_sizes'];
    })
  }
  
  
  
  addItem()
  {
    let val=JSON.parse(JSON.stringify(this.conData1));
    console.log(val);
    // && this.conData1.size_id!=''
    if(this.conData1.category_id!='' && this.conData1.product_id!=''  && this.conData1.qty!=''){
      this.contractorData.push(val);
    }
    console.log(this.contractorData);
    this.conData1.category_id='';
    this.conData1.product_id='';
    // this.conData1.size_id='';
    this.conData1.qty='';
    
  }
  
  
  deleteItem(i)
  {
    this.contractorData.splice(i,1);
    this.presentToast();
  }
  
  submit(){
    this.conData.part = this.contractorData;
    this.conData.contractor_id = this.dbService.karigar_id;
    
    if(this.contractorData < 1){
      const toast = this.toastCtrl.create({
        message: 'please add one item at least!',
        duration: 3000
      });
      toast.present();
      return
    }
    
    console.log(this.conData.employee_id);
    console.log(this.conData.part);
    this.dbService.post_rqst( this.conData,'app_karigar/add_contractor_request ').subscribe( r =>
      {
        console.log(r);
        if(r['status'] == 'SUCCESS'){
          this.navCtrl.push(ContractorListPage);
        }
      });
    }
    
    
    MobileNumber(event: any) {
      const pattern = /[0-9]/;
      let inputChar = String.fromCharCode(event.charCode);
      if (event.keyCode != 8 && !pattern.test(inputChar)) {
        event.preventDefault();
      }
    }
    
  }
  