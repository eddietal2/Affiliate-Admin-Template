import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { ProductsService } from 'src/app/services/products/products.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AlertController, IonAccordionGroup , LoadingController} from '@ionic/angular';
import { formatDistance } from 'date-fns';

@Component({
  selector: 'app-products',
  templateUrl: './products.page.html',
  styleUrls: ['./products.page.scss'],
})
export class ProductsPage implements OnInit {
  allProducts$ = new BehaviorSubject([]);
  allProducts = [];


  constructor(
    private formBuilder: FormBuilder,
    private productsService: ProductsService,
    private alertController: AlertController,
    private loadingController: LoadingController,
  ) { }

  ngOnInit() {
    this.createFormGroups();
    this.getAllProducts();

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
        this.allProducts$.next(Object.values(products));

        this.allProducts$.subscribe( products => {
          products.forEach((product) => {
            // For each individual modal
            product.datePosted = formatDistance(
              product.datePosted,
              Date.now()
            )
            product.isOpen = false;
          })

          this.allProducts = products.reverse();
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
                  return this.allProducts = products['remainingProducts'];
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
        console.log(a.datePosted);
        
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
  
  @HostListener('unloaded')
  ngOnDestroy() {
    console.log('Products Page destroyed');
  }

}
