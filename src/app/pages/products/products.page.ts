import { AfterViewInit, ChangeDetectorRef, Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { BehaviorSubject, of, Subscription } from 'rxjs';
import { ProductsService } from 'src/app/services/products/products.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AlertController, IonAccordionGroup , LoadingController, ToastController} from '@ionic/angular';
import { formatDistance } from 'date-fns';
import {Howl, Howler} from 'howler';
import { catchError } from 'rxjs/operators';


@Component({
  selector: 'app-products',
  templateUrl: './products.page.html',
  styleUrls: ['./products.page.scss'],
})
export class ProductsPage implements OnInit, AfterViewInit, OnDestroy {
  allProducts$ = new BehaviorSubject([]);
  allProducts = [];

  constructor(
    private formBuilder: FormBuilder,
    private productsService: ProductsService,
    private alertController: AlertController,
    private loadingController: LoadingController,
    public toastController: ToastController,
    public changeDetectorRef: ChangeDetectorRef,
  ) { }

  ngAfterViewInit() {

   
  }

  ngOnInit() {
    this.createFormGroups();
    this.getAllProducts();
    this.checkToggled();
    this.triggerSkeletonView();

  }

  @HostListener('unloaded')
  ngOnDestroy() {
    console.log('Products Page destroyed');
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


  /**
   * Initialize Forms
   */
   editProductForm: FormGroup;
   addProductForm: FormGroup;

  createFormGroups() {
    this.addProductForm = this.formBuilder.group({
      title: ['xXx', [Validators.required]],
      apiID: ['CSCONVREF', [Validators.required]],
      category: ['sleep', [Validators.required]],
      price: [45, [Validators.required]],
      description: ['test', [Validators.required]],
      sample: ['test', [Validators.required]],
      duration: [40, [Validators.required]]
    })


    this.editProductForm = this.formBuilder.group({
      title: ['', [Validators.required]],
      apiID: ['', [Validators.required]],
      category: ['', [Validators.required]],
      price: ['', [Validators.required]],
      description: ['', [Validators.required]],
      duration: ['', [Validators.required]],
      sample: ['', [Validators.required]]
    })
    
  }

  /**
   * Get All Products
   */
  getAllProducts() {
    this.productsService.getAllProducts()
      .subscribe(products => {

        // Set initial value for All Products BehaviorSubject
        this.allProducts$.next(Object.values(products));
        this.allProducts$.subscribe( async products => {

          // Format Product Objects
          await products.forEach((product) => {

            product.formattedDate = formatDistance(
              product.datePosted,
              Date.now()
            )

            // Add isOpen property for modals.
            product.isOpen = false;

            // Add Product Sample Icon for each product
            product.buttonIcon = 'play';

            // For Pause / Play Toggle
            product.sampleToggle = false;

            // Convert Sample time to 0 - 1 duration
            product.sampleDuration = 0;

            // Capture sample location when paused
            product.trackDuration = 0;

          });

          // Reverse to set most recently added Products to top
          this.allProducts = await products.reverse();
        })
      })

  }

  /**
   * Edit Product
   */

   editProductModalOpen = false;

   openEditProductModal(
    id: string, 
    apiID: string, 
    title: string, 
    duration: number, 
    sample: string, 
    category: string, 
    price: number,
    description: string) {

     this.allProducts.filter(product => {
      if(product._id == id)
      product.isOpen = true;
     })

    this.editProductForm = this.formBuilder.group({
      title: [title, [Validators.required]],
      apiID: [apiID, [Validators.required]],
      category: [category, [Validators.required]],
      sample: [sample, [Validators.required]],
      duration: [duration, [Validators.required]],
      price: [price, [Validators.required]],
      description: [description, [Validators.required]]
    })

     this.editProductModalOpen = true;
   }


   /**
    * Close Edit Product Modal
    */
   closeEditProductModal(id: string) {
    this.allProducts.filter(product => {
     if(product._id == id)
     product.isOpen = false;
    })
   }

   editProductSub: Subscription;

   /**
    * 
    */
   tryEditProduct(id: string) {

      let form = this.editProductForm.value;
      
  
      this.editProductSub = this.productsService.editProduct(
        id,
        form.apiID,
        form.title,
        form.duration,
        form.sample,
        form.category,
        form.price,
        form.description,
      ).subscribe( async products => {
        console.log(products)
  
        const loading = await this.loadingController.create({
          cssClass: 'my-custom-class',
          message: 'Editting Product ...',
          duration: 2000
        });
        await loading.present();
        await this.editProductForm.reset();
        await this.closeEditProductModal(id);
        // TODO Add Success Toast
        await loading.onDidDismiss().then(() => {
        return this.allProducts = Object.values(products);
        });
      })

   }


   addProductModal = false;
   addProductSub: Subscription;

   /**
   * Oen Add Product Modal
   */
    openAddProductModal() {

    this.addProductModal = true;

    }
    /**
     * Close Edit Product Modal
     */
  closeAddProductModal() {
     this.addProductModal = false;
  }
  
   /**
   * Add a Product
   */
   tryAddProduct() {
    console.clear()
    console.log(this.addProductForm.value)

    let form = this.addProductForm.value;

    this.addProductSub = this.productsService.addProduct(
      form.title,
      form.apiID,
      form.description,
      form.category,
      form.duration,
      form.price,
      form.sample,
    ).subscribe( async products => {

      const loading = await this.loadingController.create({
        cssClass: 'my-custom-class',
        message: 'Adding Product ...',
        duration: 2000
      });

      await loading.present();
      await this.addProductForm.reset();
      await this.closeAddProductModal();

      // TODO Add Success Toast
      await loading.onDidDismiss().then(async () => {
         // Format Product Objects
         await Object.values(products).forEach(product => {

          product.formattedDate =  formatDistance(
            product.datePosted,
            Date.now()
          )

          // Add isOpen property for modals.
          product.isOpen = false;

          // Add Product Sample Icon for each product
          product.buttonIcon = 'play';

          // For Pause / Play Toggle
          product.sampleToggle = false;

          // Convert Sample time to 0 - 1 duration
          product.sampleDuration = 0;

          // Capture sample location when paused
          product.trackDuration = 0;

        });
        this.allProducts = await Object.values(products);

        this.filterOption = 'date';
        await this.allProducts.sort((a, b) => {
          return b.datePosted - a.datePosted;
        });
      });

    })

    }

  /**
   * Select Category for Add Product
   */
   changeCategory(e) {
     console.log(e);
     
   }

  /**
   * Delete a Product
   */
  deleteProductSub: Subscription;

  async tryDeleteProduct(id: string) {
    console.log(id)
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Delete this Product?',
      message: 'Are you sure you want to Delete this Product? This cannot be undone.',
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
          text: 'Delete',
          id: 'confirm-button',
          handler: () => {
            this.deleteProductSub = this.productsService.deleteProduct(id).
              subscribe( async products => {

                const loading = await this.loadingController.create({
                  cssClass: 'my-custom-class',
                  message: 'Deleting User ...',
                  duration: 2000
                });
                await loading.present();
                // TODO Add Success Toast
                await loading.onDidDismiss().then(() => {
                  return setTimeout(() => {
                    this.allProducts = products['remainingProducts'];
                    this.changeDetectorRef.detectChanges();
                  }, 0);
                });
              })
          }
        }
      ]
    });

    await alert.present();
  }

  /**
   * Cloase a Product Accordian
   */
   closeProduct(accordian: IonAccordionGroup) {
    console.log(accordian)
    accordian.value = undefined;
  }

  filterOption = 'date';

  filterDateAsc = false;
  filterDateDes = true;

  /**
   * Filter by Date when Added
   */
   filterByDate() {
    this.filterOption = 'date'

    if(this.filterDateAsc) {

      this.allProducts.sort((a, b) => {
        
        return b.datePosted - a.datePosted;
      });
      
      this.filterDateAsc = false;
      this.filterDateDes = true;
      

    } else {

      this.allProducts.sort((a, b) => {
        return (a.datePosted) - (b.datePosted);
      });

      this.filterDateAsc = true;
      this.filterDateDes = false;

    }

   }

  filterNameAsc = false;
  filterNameDes = true;

  /**
   * Filter by Age
   */
   filterByName() {

    this.filterOption = 'name';
      
    if(this.filterNameAsc) {

      this.allProducts.sort((a, b) => {
        let fa = a.title.toLowerCase(),
        fb = b.title.toLowerCase();

        if (fa < fb) {
            return -1;
        }
        if (fa > fb) {
            return 1;
        }
        return 0;
      })
      
      this.filterNameAsc = false;
      this.filterNameDes = true;

    }

    else {

      this.allProducts.sort((a, b) => {
        let fa = a.title.toLowerCase(),
        fb = b.title.toLowerCase();

        if (fa < fb) {
            return 1;
        }
        if (fa > fb) {
            return -1;
        }
        return 0;
      })

      this.filterNameAsc = true;
      this.filterNameDes = false;

    }

   }

  filterPriceAsc = false;
  filterPriceDes = true;

  /**
   * Filter by Price
   */
   filterByPrice() {
    this.filterOption = 'price'

    if(this.filterPriceAsc) {

      this.allProducts.sort((a, b) => {
        return b.price - a.price;
      });
      
      this.filterPriceAsc = false;
      this.filterPriceDes = true;
      

    } else {

      this.allProducts.sort((a, b) => {
        return a.price - b.price;
      });

      this.filterPriceAsc = true;
      this.filterPriceDes = false;
    }

   }

  filterRatingAsc = false;
  filterRatingDes = true;

  /**
   * Filter by Rating
   */
   filterByRating() {
    this.filterOption = 'rating'

    if(this.filterRatingAsc) {

      this.allProducts.sort((a, b) => {
        return b.rating - a.rating;
      });
      
      this.filterRatingAsc = false;
      this.filterRatingDes = true;
      

    } else {

      this.allProducts.sort((a, b) => {
        return a.rating - b.rating;
      });

      this.filterRatingAsc = true;
      this.filterRatingDes = false;

    }

   }
  
  toggleFeatured(e, product, toggleRef) {
    console.log(e);
    e.preventDefault();
    
    let eventDetail = e.detail.checked;

    // Set Product to Featured
    if(eventDetail) {
      console.log('Featured.');
      this.productsService.featureProduct(product._id)
      .pipe(
        catchError(e => {
          if(e.error.msg = 'There are already 3 Featured Products') {
            console.log(toggleRef);
            product.featured = false;
            this.errorToast(); 
            
          }
          
          throw new Error(e);
        })
      ) 
      .subscribe(async res => {
          const toast = await this.toastController.create({
            cssClass: 'success-toast',
            position: 'top',
            message: 'Product has been Featured.',
            duration: 2000
        });
        toast.present();

        product.featured = !product.featured;
        });
      
    }

    // Set Product to Unfeatured
    if(!eventDetail) {
      console.log('Unfeatured.');
      this.productsService.unfeatureProduct(product._id)
        .subscribe(async res => {
          product.featured = !product.featured;
        });
      
    }
  }



  async errorToast() {
    const toast = await this.toastController.create({
      message: 'You can only have 3 Featured Products',
      cssClass: 'danger-toast',
      position: 'top',
      duration: 2000
    });
    toast.present();
  }

  checkToggled() {
    this.allProducts.forEach(product => {
      console.log(product.featured + ' / ' + product.title);
      
    });
    
  }

 

  playSample(product, musicIcon) {

    let timeInterval = null;
    let newTimer = false;
    let sound = new Howl({
       html5: true,
       src: product.sample,
       sprite: {
         sample: [19000, 25000]
       },
     });
  
    if(!newTimer) {

      newTimer = true;
      timeInterval = setInterval(() => {

        function updateSampleTime(sound, callback) {
          if (sound.playing()) {
            let width = (sound.seek()/sound.duration());
            console.log('Seek: ' + sound.seek());            
            return callback(sound.duration());
          }
        }

        // Fires every interval to update sample time and UI
        updateSampleTime(sound, (trackDuration) => {

          product.sampleDuration = product.sampleDuration + 0.005;
          product.trackDuration = trackDuration;
  
          // If Time is stop in the middle of Playing.
          if(product.sampleToggle == false) {
            sound.pause();
            product.sampleDuration = 0;
            clearInterval(timeInterval);
            return;
          }
          
          // When sample is finished playing, change sample button to
          // refresh, change UI timer to 0, stop progress bar animation,
          // unload song, and stop Interval timer.
          if(product.sampleDuration >= 1) {
            
            product.sampleDuration = 1;
            product.buttonIcon = 'refresh-outline';
            product.sampleDuration = 0;

            clearInterval(timeInterval);
            sound.stop();
            return;
          }
        }); 
      }, 100);

    }

    // Play
    if(product.sampleToggle == false) {

      product.sampleToggle = true;
      musicIcon.el.style.color = '#ff9158';
      musicIcon.el.style.transform = 'scale(1.25)';
      sound.play('sample');

      // Change Icon &
      return product.buttonIcon = 'pause';
    } 

    // Pause
    if(product.sampleToggle == true) {

      product.sampleToggle = false;
      product.trackDuration = sound.seek();
      musicIcon.el.style.color = '#fff';
      musicIcon.el.style.transform = 'scale(1)';
      console.log(sound);
      
      sound.pause(sound);

      return product.buttonIcon = 'play';
      }    
  }


  

}
