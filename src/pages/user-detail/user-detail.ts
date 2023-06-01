import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AlertController, IonicPage, Loading, LoadingController, ModalController, NavController, NavParams } from 'ionic-angular';
import { ConstantProvider } from '../../providers/constant/constant';
import { DbserviceProvider } from '../../providers/dbservice/dbservice';
import { OffersPage } from '../offers/offers';
import { PurchaseDetailPage } from '../purchase/purchase-detail/purchase-detail';
import { SiteDetailPage } from '../site/site-detail/site-detail';
import { ViewProfilePage } from '../view-profile/view-profile';

/**
* Generated class for the UserDetailPage page.
*
* See https://ionicframework.com/docs/components/#navigation for more info on
* Ionic pages and navigation.
*/

@IonicPage()
@Component({
  selector: 'page-user-detail',
  templateUrl: 'user-detail.html',
})
export class UserDetailPage {
  loading:Loading;
  karigar_detail:any={};
  id:any ={}
  offer_list:any =[];
  uploadUrl:any='';
  regUser:any
  details: string = "basic";
  filter:any = {};
  data:any =[];
  purData:any =[];
  flag:any='';
  userFilter:any ={};
  
  
  
  constructor(public navCtrl: NavController, public navParams: NavParams,public service:DbserviceProvider,public loadingCtrl:LoadingController,public alertCtrl:AlertController,public modalCtrl: ModalController,public db:DbserviceProvider,public translate:TranslateService, public constant:ConstantProvider){
    this.id = this.navParams.get('id');
    this.regUser = navParams.data['user_type'];
    if(this.regUser == 'Pc'){
      this.userFilter = navParams.data['userFilter'];
    }

    this.presentLoading();
    this.uploadUrl = this.constant.upload_url;
    
  }
  
  ionViewDidLoad() {
    console.log('ionViewDidLoad UserDetailPage');
  }
  ionViewWillEnter()
  {
    this.getKarigarDetail();
  }
  
  presentLoading() 
  {
    this.translate.get('Please wait...')
    .subscribe(resp=>{
      this.loading = this.loadingCtrl.create({
        content: resp,
        dismissOnPageChange: false
      });
      this.loading.present();
    })
  }
  getKarigarDetail()
  {
    console.log('karigar');
    
    this.service.post_rqst( {'karigar_id': this.id },'app_karigar/profile')
    .subscribe((r) =>
    {
      console.log(r);
      this.loading.dismiss();
      console.log(this.karigar_detail);
      this.karigar_detail=r['karigar'];
    });
  }
  
  getSite(){
    this.presentLoading();
    this.filter.limit = 0;
    this.filter.pc_id = this.id;
    
    this.service.post_rqst( { 'filter': this.filter}, 'app_karigar/getPcSite').subscribe( r =>
      {
        console.log(r);
        this.loading.dismiss();
        this.data = r.site_locations;
        this.filter.mode = 1;
      });
      
    }
    
    loadData(infiniteScroll)
    {
      console.log('loading');
      this.filter.pc_id = this.id;
      this.filter.limit=this.data.length;
      this.service.post_rqst({'filter' : this.filter},'app_karigar/getPcSite')
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
    
    
    getofferList()
    {
      this.presentLoading();
      this.service.post_rqst({'karigar_id':this.id},'app_karigar/offerList')
      .subscribe((r)=>
      {
        console.log(r);
        this.loading.dismiss();
        this.offer_list=r['offer'];
        console.log(this.offer_list);
      });
    }
    
    
    getPurchase(){
      this.presentLoading();
      this.filter.limit = 0;
      this.filter.pc_id = this.id;
      this.service.post_rqst( { 'filter': this.filter}, 'app_karigar/getPcPurchase').subscribe( r =>
        {
          console.log(r);
          this.loading.dismiss();
          this.purData = r.purchase_orders;
          
          this.filter.mode = 1;
        });
        
      }
      
      
      loadPurData(infiniteScroll)
      {
        this.filter.limit=this.purData.length;
        this.filter.pc_id = this.id;
        this.service.post_rqst({'filter' : this.filter},'app_karigar/getPcPurchase')
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
              this.purData=this.data.concat(r['purchase_orders']);
              infiniteScroll.complete();
            },1000);
          }
        });
      }


      goOnOffersPage(id)
      {
          this.navCtrl.push(OffersPage,{'id':id});
          
      }
      
      purchaseDetail(id){
        this.navCtrl.push(PurchaseDetailPage, {'id':id, 'user_type':this.regUser});
      }
      goOnSiteDetail(id){
        this.navCtrl.push(SiteDetailPage, {'id':id, 'user_type':this.regUser});
      }
      viewProfiePic()
      {
        this.modalCtrl.create(ViewProfilePage, {"Image": this.karigar_detail.profile,"type":"base_64"}).present();
      }
      viewDoc()
      {
        this.modalCtrl.create(ViewProfilePage, {"Image": this.karigar_detail.document_image,"type":"base_64"}).present();
      }
      viewDocBack()
      {
        this.modalCtrl.create(ViewProfilePage, {"Image": this.karigar_detail.document_image_back,"type":"base_64"}).present();
      }
      
    }
    