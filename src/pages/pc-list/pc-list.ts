import { PotentialUpdatePage } from './../potential-update/potential-update';
import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { IonicPage, Loading, LoadingController, NavController, NavParams } from 'ionic-angular';
import { DbserviceProvider } from '../../providers/dbservice/dbservice';
import { UserAddPage } from '../user-add/user-add';
import { UserDetailPage } from '../user-detail/user-detail';
import { VerifypcPage } from '../verifypc/verifypc';

/**
* Generated class for the PcListPage page.
*
* See https://ionicframework.com/docs/components/#navigation for more info on
* Ionic pages and navigation.
*/

@IonicPage()
@Component({
  selector: 'page-pc-list',
  templateUrl: 'pc-list.html',
})
export class PcListPage {
  
  loading:Loading;
  filter:any = {};
  flag:any='';
  pcData:any =[];
  details: string = "Pending";
  userType:any;
  zone:any;
  pclist:any=[];
  approval_right:any;
  userFilter:any ={};
  
  constructor(public navCtrl: NavController, public navParams: NavParams, public dbService:DbserviceProvider, public translate:TranslateService, public loadingCtrl:LoadingController) {
    this.userType = navParams.data['user_type'];
    console.log(this.userType);
    
    this.userFilter = navParams.data['userFilter'];
    this.approval_right = navParams.data['approval_right'];
    this.getZone();
    this.presentLoading();
    // this.pcList()
  
    
  }
  
  ionViewDidLoad() {
    
    console.log('ionViewDidLoad pcListPage');
  }
  
  ionViewWillEnter(){
    this.getZone();

  }
  
  // ionviewwillenter(){
  //   this.presentLoading();
  //   if(this.userType == 3){
  //     this.pcList('', this.details);
  //   }
  //   else{
  //     this.myPc('');
  //   }
  // }
  
  // ionViewWillEnter(){
  //   if(this.userType == 3){
  //     this.pcList('', this.details);
  //   }
  //   else{
  //     this.myPc('');
  //   }
  // }
  
  
  
  
  
  
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
  
  
  doRefresh(refresher, status) 
  {
    if(this.userType == 3){
      this.pcList('', status); 
    }
    else{
      this.myPc('');
    }
    refresher.complete();
  }
  doRefresh1(refresher) 
  {
    
  }
  
  
  getZone(){
    this.dbService.post_rqst( {'karigar_id':this.dbService.karigar_id}, 'app_karigar/karigarZone').subscribe( r =>
      {
        console.log(r);
        this.zone = r.karigar.sales_zone;

        if(this.userType == 3){
          this.pcList('', this.details);
        }
        else{
          this.myPc('');
        }
      });
    }
    
    pending_count:any =0;
    rejected_count:any =0;
    verified_count:any =0;
    
    tab:string='';
    pcList(search, status){
      this.filter.limit = 0;
      this.filter.search=search;
      this.filter.status=status;
      this.filter.sales_zone=this.zone;
      this.filter.pc_id = this.dbService.karigar_id;
      this.dbService.post_rqst( {'user_type':this.userFilter, 'filter': this.filter}, 'app_karigar/getSalesUserPC').subscribe( r =>
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
      
      myPc(search){
        this.filter.limit = 0;
        this.filter.search=search;
        this.filter.status=status;
        this.filter.sales_zone=this.zone;
        this.dbService.post_rqst( { 'filter': this.filter, 'pc_id':this.dbService.karigar_id, 'user_type':this.userFilter}, 'app_karigar/getDealerPcs').subscribe( r =>
          {
            console.log(r);
            this.loading.dismiss();
            
            this.pcData = r.data;
            console.log(this.pcData);
            
            this.pending_count = r.pending_count;
            this.rejected_count = r.rejected_count;
            this.verified_count = r.verified_count;
            console.log(this.pcData);
            
            this.filter.mode = 1;
          });
          
        }
        
        
        changeStatus(id, status){
          console.log(id);
          
          this.navCtrl.push(VerifypcPage,{"id":id, "status":status})
        }

      
        changeStatusPotential_bag(id, pc_potential){
          console.log(id);
          console.log(pc_potential);
          
          this.navCtrl.push(PotentialUpdatePage,{"id":id, "pc_potential":pc_potential})
        }
        
        
        
        
        loadData(infiniteScroll)
        {
          this.filter.limit=this.pcData.length;
          let url
          let reqBody
          if(this.userType == 3){
            url = 'app_karigar/getSalesUserPC'
            reqBody = {'filter' : this.filter, 'user_type':this.userFilter};
          }
          else{
            url = 'app_karigar/getDealerPcs'
            reqBody = {'filter' : this.filter, 'pc_id':this.dbService.karigar_id,'user_type':this.userFilter}
          }
          
          this.dbService.post_rqst(reqBody, url)
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
        
        
        addPc(){
          this.navCtrl.push(UserAddPage, {'user_type':'Pc','userFilter':this.userFilter})
        }
        Detail(id){
          this.navCtrl.push(UserDetailPage, {'user_type':'Pc', 'id':id, 'userFilter':this.userFilter})
        }
      }
      