import { PcListPage } from './../pc-list/pc-list';
import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AlertController, IonicPage, NavController, NavParams } from 'ionic-angular';
import { DbserviceProvider } from '../../providers/dbservice/dbservice';

/**
 * Generated class for the VerifypcPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-verifypc',
  templateUrl: 'verifypc.html',
})
export class VerifypcPage {
  id:any='';
  filter:any= {};
  pclists:any=[];
  data  :any={}
  save_succ:any="";
  ok:any="";


  constructor(public navCtrl: NavController,public service:DbserviceProvider, public alertCtrl: AlertController, public translate:TranslateService, public navParams: NavParams) {
  this.id = this.navParams.get('id');

  this.data.status = this.navParams.get('status');


  
  console.log("id is ==>",this.id)
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad VerifypcPage');

    this.translate.get("OK")
    .subscribe(resp=>{
      this.ok = resp
    });

    this.translate.get("Profile status change successfully")
    .subscribe(resp=>{
      this.save_succ = resp
    });
    // this.getData();
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
  
 



  submit(id){
      console.log("id i s ==>",id)
      console.log("pc status==>",this.data.status)

      this.saveFlag = true;

      // return;
      this.service.post_rqst({'id':this.id,"status":this.data.status,'karigar_id':this.service.karigar_id,'reason':this.data.reason, 'pc_potential':this.data.pc_potential},'app_karigar/karigarStatus')
        .subscribe((r:any)=>
        {
            console.log(r);
            this.pclists = r['pcs'];
            if(r['status'] == 'SUCCESS'){
              // this.getData()
            this.showUpdate(this.save_succ);

              // this.navCtrl.pop();
              this.navCtrl.popTo(PcListPage);


            }
            
           
        });
    }


    saveFlag :boolean = false;
    update_potential(id){
      console.log("id i s ==>",id)
      this.saveFlag = true;

      this.service.post_rqst({'karigar_id':this.id,'pc_potential':this.data.pc_potential},'app_karigar/potential_update')
        .subscribe((r:any)=>
        {
            console.log(r);
            this.pclists = r['pcs'];
            if(r['status'] == 'SUCCESS'){
              // this.getData()
            this.showUpdate(this.save_succ);

              // this.navCtrl.pop();
              this.navCtrl.popTo(PcListPage);


            }
            
           
        });
    }
 
}
