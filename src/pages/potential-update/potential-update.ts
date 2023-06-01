import { PcListPage } from './../pc-list/pc-list';
import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AlertController, IonicPage, NavController, NavParams } from 'ionic-angular';
import { DbserviceProvider } from '../../providers/dbservice/dbservice';

/**
 * Generated class for the PotentialUpdatePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-potential-update',
  templateUrl: 'potential-update.html',
})
export class PotentialUpdatePage {
  data  :any={}
  id:any='';

  constructor(public navCtrl: NavController, public navParams: NavParams,public service:DbserviceProvider, public alertCtrl: AlertController, public translate:TranslateService) {
  
  this.data.pc_potential = this.navParams.get('pc_potential');
  if(this.data.pc_potential == 0){
    this.data.pc_potential = '';
  }
  this.id = this.navParams.get('id');

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PotentialUpdatePage');
  }

  save_succ:any="";
  saveFlag :boolean = false;
  update_potential(id){
    console.log("id i s ==>",id)
    this.saveFlag = true;

    this.service.post_rqst({'karigar_id':this.id,'pc_potential':this.data.pc_potential},'app_karigar/potential_update')
      .subscribe((r:any)=>
      {
          console.log(r);
          // this.pclists = r['pcs'];
          if(r['status'] == 'SUCCESS'){
            // this.getData()
          this.showUpdate(this.save_succ);

            // this.navCtrl.pop();
            this.navCtrl.popTo(PcListPage);


          }
          
         
      });
  }

  ok:any="";
  showUpdate(text)
  {
    this.translate.get("Successfully Updated your potential bag")
    .subscribe(resp=>{
      let alert = this.alertCtrl.create({
        subTitle:resp+'!',
        cssClass:'action-close',
        // subTitle: text,
        buttons: [{
          text:'OK',
          role:'ok',
          handler: () => {
            
          }
        }
          // this.ok
        ]
      });
      alert.present();
    })
  }
}
