import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,LoadingController, ModalController, ViewController, AlertController} from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import { DbserviceProvider } from '../../providers/dbservice/dbservice';


@IonicPage()
@Component({
  selector: 'page-cancelation-policy',
  templateUrl: 'cancelation-policy.html',
})
export class CancelationPolicyPage {
  get_cancellation_policy:any;
  loading:any;

  constructor(public viewCtrl:ViewController,public modalCtrl: ModalController,public alertCtrl:AlertController,public translate:TranslateService,public service:DbserviceProvider,public navCtrl: NavController, public navParams: NavParams,public loadingCtrl:LoadingController,) {
  
  
  }
  // ngOnInit() {
  //   const modalState = {
  //     modal : true,
  //     desc : 'fake state for our modal'
  //   };
  //   history.pushState(modalState, null);
  // }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CancelationPolicyPage');
    this.get_notification()

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

  showAlert(text) {
    let alert = this.alertCtrl.create({
        title:'Alert!',
        cssClass:'action-close',
        subTitle: text,
        buttons: [{
            text: 'Cancel',
            role: 'cancel',
            handler: () => {
                console.log('Cancel clicked');
            }
        },
        {
            text:'OK',
            cssClass: 'close-action-sheet',
            handler:()=>{
                // this.navCtrl.push(TransactionPage);
            }
        }]
    });
    alert.present();
}

  get_notification()
  {
      this.presentLoading()
      this.service.post_rqst({},"app_karigar/get_cancellation_policy")
      .subscribe(resp=>{
        this.loading.dismiss();
          console.log("policy ===>",resp);
          if(resp.getData == null){
            this.showAlert("Cancellation Policy Not Found");
            return;
          }else{
            this.get_cancellation_policy = resp.getData.tnc;

          }
      })

  }

  closmodal(){
    this.viewCtrl.dismiss();
  }
 

 

}
