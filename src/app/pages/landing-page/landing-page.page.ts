import { ChangeDetectorRef, Component, HostListener, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { BehaviorSubject, Subscription } from 'rxjs';
import { LandingPageService } from 'src/app/services/landing-page/landing-page.service';
import { ProductsService } from 'src/app/services/products/products.service';


interface LandingPageInfo {
  _id: string,
  welcomeMessage: string,
  sample: string,
  featuredProducts: Array<String>,
  description: string,
  membershipMessage: string,
}

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.page.html',
  styleUrls: ['./landing-page.page.scss'],
})
export class LandingPagePage implements OnInit {
  getFeaturedProductsSub: Subscription;
  featuredProducts: any;


  constructor(
    private landingPageService: LandingPageService,
    private productsService: ProductsService,
    private alertController: AlertController,
    public changeDetectorRef: ChangeDetectorRef,
  ) { }

  ngOnInit() {
    this.getLandingPageInfo();
    this.triggerSkeletonView();
    
  }

  @HostListener('unloaded')
  ngOnDestroy() {
    this.getLandingPageInfoSub.unsubscribe();
    this.skeletonData = true;
  }

  skeletonData = true;

  /**
   * Trigger Skeleton UI
   */
   triggerSkeletonView() {
    setTimeout(() => {
      this.skeletonData = false;
      this.changeDetectorRef.detectChanges();
    }, 2000);

    return;
  }


  getLandingPageInfoSub: Subscription;
  landingPageInfo: LandingPageInfo;
  landingPageInfo$ = new BehaviorSubject([]);
  id: string;

  /**
   * Get Landing Page Information 
   */
  getLandingPageInfo() {
    this.getLandingPageInfoSub = this.landingPageService.getLandingPageInfo()
      .subscribe((info) => {
        this.landingPageInfo$.next(info['landingPageInfo'][0]);
        this.featuredProducts = info['landingPageInfo'][0].featuredProducts;
        this.id = info['landingPageInfo'][0]._id;
        this.productsService.getAllProducts().subscribe(
          products => {

            this.featuredProducts = Object.values(products)
            .filter(item => this.featuredProducts.includes(item._id));
            
            console.log(Object.values(products));
            console.log(this.featuredProducts); 
          }
        )
        
        return;
      })
  }

  // getFeaturedProducts() {
  //   this.getFeaturedProductsSub = this.landingPageService.getAllProducts()
  //     .subscribe((info) => {
  //       console.log(info);
        
  //       this.landingPageInfo$.next(info['landingPageInfo'][0]);
  //       this.id = info['landingPageInfo'][0]._id;
  //     })
  // }

  disableWelomeMessageInput = false;
  welcomeMessageSpinner = false;

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
                  //  this.changeDetectorRef.detectChanges();  
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
                  // this.changeDetectorRef.detectChanges();    
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
    * Track the Input of Welcome Message Input
    */
   descriptionInputCount = 0;
   descriptionInputEvent(e: Event) {
     console.log(e);
     console.log(this.disableDescriptionInput);
     
    this.descriptionInputCount++;
 
    if(this.descriptionInputCount > 0) {
      return this.disableDescriptionInput = true;
    }
    // console.log(e);
    
   }
 
   disableDescriptionInput = false;
   descriptionSpinner = false;
  /**
   * 
   */
  async editDescription(input) {
    const alert = await this.alertController.create({
      cssClass: 'edit-landing-page-alert',
      header: 'Edit Description',
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
            this.descriptionSpinner = true;
            this.landingPageService.editDescriptionHTTP(this.id, input.value)
             .subscribe((updatedLandingPageInfo: any) => {

               this.landingPageInfo$.next(updatedLandingPageInfo);
               this.disableDescriptionInput = false;
               this.descriptionSpinner = false; 


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
   async cancelEditDescription(input) {
     console.log(input);
     console.log(this.landingPageInfo$.value);
     input.value = this.landingPageInfo$.value['description'];
     setTimeout(() => {
      this.disableDescriptionInput = false;
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
            this.landingPageService.editMembershipHTTP(this.id, input.value)
             .subscribe((updatedLandingPageInfo: any) => {

               this.landingPageInfo$.next(updatedLandingPageInfo);
               this.membershipMessageInputCount = 0;
               this.disableMembershipMessageInput = false;
               
               console.log(updatedLandingPageInfo);
               console.log(this.landingPageInfo$.value);
               console.log(input.value);
               this.membershipMessageSpinner = true;
             })


            //  setTimeout(() => {
            //   this.membershipMessageSpinner = false;
            //  }, 0);
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
