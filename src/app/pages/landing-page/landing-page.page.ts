import { Component, HostListener, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { BehaviorSubject, Subscription } from 'rxjs';
import { LandingPageService } from 'src/app/services/landing-page/landing-page.service';

interface LandingPageInfo {
  _id: string,
  welcomeMessage: string,
  sample: string,
  featuredProducts: Array<String>,
  whyHypnosis: string,
  membershipMessage: string,
}

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.page.html',
  styleUrls: ['./landing-page.page.scss'],
})
export class LandingPagePage implements OnInit {


  constructor(
    private landingPageService: LandingPageService,
    private alertController: AlertController
  ) { }

  ngOnInit() {
    this.getLandingPageInfo();
  }

  @HostListener('unloaded')
  ngOnDestroy() {
    this.getLandingPageInfoSub.unsubscribe();
  }



  getLandingPageInfoSub: Subscription;
  landingPageInfo: LandingPageInfo;
  landingPageInfo$ = new BehaviorSubject(['']);
  id: string;

  /**
   * Get Landing Page Information 
   */
  getLandingPageInfo() {
    this.getLandingPageInfoSub = this.landingPageService.getAllProducts()
      .subscribe((info) => {

        this.landingPageInfo$.next(info['landingPageInfo'][0]);
        this.id = info['landingPageInfo'][0]._id;
      })
  }

  /**
   * Track the Input of Welcome Message Input
   */
  welcomeMessageInputCount = 0;
  welcomeMessageInputEvent(e: Event) {
   this.welcomeMessageInputCount++;

   if(this.welcomeMessageInputCount > 0) {
     this.disableWelomeMessageInput = true;
   }
   // console.log(e);
   
  }

  disableWelomeMessageInput = false;
  welcomeMessageSpinner = false;
  /**
   * 
   */
  async editWelcomeMessage(input) {
     console.log(input);
     const alert = await this.alertController.create({
       cssClass: 'edit-landing-page-alert',
       header: 'Edit Welcome Message',
       message: 'Are you sure?',
       buttons: [
         {
           text: 'Cancel',
           role: 'cancel',
           cssClass: 'secondary',
           id: 'cancel-button',
           handler: (blah) => {
             console.log('Confirm Cancel: blah');
           }
         }, {
           text: 'Okay',
           cssClass: 'confirm-button',
           handler: () => {
             console.log('Confirm Okay');
             this.welcomeMessageSpinner = true;
             this.landingPageService.editWelcomeMessageHTTP(this.id, input.value)
              .subscribe((updatedLandingPageInfo: any) => {

                this.landingPageInfo$.next(updatedLandingPageInfo);
                this.welcomeMessageInputCount = 0;
                this.disableWelomeMessageInput = false;
                

                console.clear();
                console.log(updatedLandingPageInfo);
                console.log(this.landingPageInfo$.value);


                setTimeout(() => {
                  this.welcomeMessageSpinner = false;    
                }, 800);

              })
           }
         }
       ]
     });
 
     await alert.present();
     
   }

  /**
   * 
   * @param input 
   * @param button 
   */
  async cancelEditWelcomeMessage(input, button) {
     console.log(input);
     console.log(button);
     input.value = this.landingPageInfo$.value['welcomeMessage'];
     setTimeout(() => {
      this.disableWelomeMessageInput = false;
     }, 0);
     
   }

  /**
   * Track the Input of Welcome Message Input
   */
  sampleInputCount = 0;
  sampleInputEvent(e: Event) {
   this.sampleInputCount++;

   if(this.sampleInputCount > 0) {
     this.disableSampleInput = true;
   }
   // console.log(e);
   
  }

  disableSampleInput = false;
  sampleSpinner = false;

  /**
   * 
   */
  async editSample(input) {
    const alert = await this.alertController.create({
      cssClass: 'edit-landing-page-alert',
      header: 'Edit Sample',
      message: 'Are you sure?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          id: 'cancel-button',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Okay',
          cssClass: 'confirm-button',
          handler: () => {
            console.log('Confirm Okay');
            this.sampleSpinner = true;
            this.landingPageService.editSampleHTTP(this.id, input.value)
             .subscribe((updatedLandingPageInfo: any) => {

               this.landingPageInfo$.next(updatedLandingPageInfo);
               this.sampleInputCount = 0;
               this.disableSampleInput = false;
               
               console.log(updatedLandingPageInfo);
               console.log(this.landingPageInfo$.value);
               console.log(input.value);


               setTimeout(() => {
                 this.sampleSpinner = false;    
               }, 800);

             })
          }
        }
      ]
    });
 
    await alert.present();
   }


  /**
   * 
   * @param input 
   * @param button 
   */
  async cancelEditSample(input) {
    console.log(input);
    input.value = this.landingPageInfo$.value['sampleTrack'];
    setTimeout(() => {
     this.disableSampleInput = false;
    }, 0);
    
  }

  /**
   * 
   */
  async editFeaturedProducts() {
     console.log();
     
   }

   /**
    * Track the Input of Welcome Message Input
    */
   whyHypnosisInputCount = 0;
   whyHypnosisInputEvent(e: Event) {
    this.whyHypnosisInputCount++;
 
    if(this.whyHypnosisInputCount > 0) {
      this.disableWhyHypnosisInput = true;
    }
    // console.log(e);
    
   }
 
   disableWhyHypnosisInput = false;
   whyHypnosisSpinner = false;
  /**
   * 
   */
  async editWhyHypnosis(input) {
    const alert = await this.alertController.create({
      cssClass: 'edit-landing-page-alert',
      header: 'Edit Why Hypnosis',
      message: 'Are you sure?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          id: 'cancel-button',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Okay',
          cssClass: 'confirm-button',
          handler: () => {
            console.log('Confirm Okay');
            this.whyHypnosisSpinner = true;
            this.landingPageService.editWhyHypnosisHTTP(this.id, input.value)
             .subscribe((updatedLandingPageInfo: any) => {

               this.landingPageInfo$.next(updatedLandingPageInfo);
               this.whyHypnosisInputCount = 0;
               this.disableWhyHypnosisInput = false;
               
               console.log(updatedLandingPageInfo);
               console.log(this.landingPageInfo$.value);
               console.log(input.value);


               setTimeout(() => {
                 this.whyHypnosisSpinner = false;    
               }, 800);

             })
          }
        }
      ]
    });
 
    await alert.present();
     
   }

   /**
    * 
    * @param input 
    * @param button 
    */
   async cancelEditWhyHypnosis(input) {
     console.log(input);
     console.log(this.landingPageInfo$.value);
     input.value = this.landingPageInfo$.value['whyHypnosis'];
     setTimeout(() => {
      this.disableWhyHypnosisInput = false;
     }, 0);
     
   }

  

   /**
    * Track the Input of Welcome Message Input
    */
    membershipMessageInputCount = 0;
    membershipMessageInputEvent(e: Event) {
     this.membershipMessageInputCount++;
  
     if(this.membershipMessageInputCount > 0) {
       this.disableMembershipMessageInput = true;
     }
     // console.log(e);
     
    }
  
    disableMembershipMessageInput = false;
    membershipMessageSpinner = false;
   /**
    * 
    */
   async editMembershipMessage(input) {
    const alert = await this.alertController.create({
      cssClass: 'edit-landing-page-alert',
      header: 'Edit Membership Message',
      message: 'Are you sure?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          id: 'cancel-button',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Okay',
          cssClass: 'confirm-button',
          handler: () => {
            console.log('Confirm Okay');
            this.membershipMessageSpinner = true;
            this.landingPageService.editMembershipHTTP(this.id, input.value)
             .subscribe((updatedLandingPageInfo: any) => {

               this.landingPageInfo$.next(updatedLandingPageInfo);
               this.membershipMessageInputCount = 0;
               this.disableMembershipMessageInput = false;
               
               console.log(updatedLandingPageInfo);
               console.log(this.landingPageInfo$.value);
               console.log(input.value);


               setTimeout(() => {
                 this.membershipMessageSpinner = false;    
               }, 800);

             })
          }
        }
      ]
    });
 
    await alert.present();
   }
   /**
    * 
    * @param input 
    * @param button 
    */
   async cancelEditMembershipMessage(input) {
     console.log(input);
     console.log(this.landingPageInfo$.value);
     input.value = this.landingPageInfo$.value['membershipMessage'];
     setTimeout(() => {
      this.disableMembershipMessageInput = false;
     }, 0);
     
   }

   
}
