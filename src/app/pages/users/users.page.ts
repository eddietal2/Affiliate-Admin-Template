import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { UsersService } from 'src/app/services/users/users.service';
import { AlertController, LoadingController, IonAccordionGroup } from '@ionic/angular';
import { formatDistance } from 'date-fns';

@Component({
  selector: 'app-users',
  templateUrl: './users.page.html',
  styleUrls: ['./users.page.scss'],
})
export class UsersPage implements OnInit {
  getAllUsersSub: Subscription;
  allUsers = [];

  constructor(
    private usersService: UsersService,
    private alertController: AlertController,
    private loadingController: LoadingController,
    public changeDetectorRef: ChangeDetectorRef,
  ) { 
  }

  ngOnInit() {
    this.triggerSkeletonView();
    this.usersService.getAllUsers().subscribe(
      users => {
        this.allUsers = Object.values(users);
        Object.values(users).forEach(user => {
          console.log(user);
          
          user.formattedDate = formatDistance(
            user.dateRegistered,
            Date.now()
          )

        });

        this.allUsers = Object.values(users);
        console.log(this.allUsers);
      }
    )
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
   * 
   * @param id 
   */
  deleteUserSub: Subscription;

  async tryDeleteUser(id: string) {
    console.log(id);
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Delete this User?',
      message: 'Are you sure you want to Delete this User? This cannot be undone.',
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
            this.deleteUserSub = this.usersService.deleteUser(id).
              subscribe( async users => {

                const loading = await this.loadingController.create({
                  cssClass: 'my-custom-class',
                  message: 'Deleting User ...',
                  duration: 2000
                });
                await loading.present();
                await loading.onDidDismiss().then(() => {
                  return this.allUsers = users['remainingUsers'];
                });
              })
          }
        }
      ]
    });

    await alert.present();


  }

  /**
   * 
   * @param accordian 
   */
  tryCloseUser(accordian: IonAccordionGroup) {
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

      this.allUsers.sort((a, b) => {
        
        return b.dateRegistered - a.dateRegistered;
      });
      
      this.filterDateAsc = false;
      this.filterDateDes = true;
      

    } else {

      this.allUsers.sort((a, b) => {
        return (a.dateRegistered) - (b.dateRegistered);
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

      this.allUsers.sort((a, b) => {
        let fa = a.fullName.toLowerCase(),
        fb = b.fullName.toLowerCase();

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

      this.allUsers.sort((a, b) => {
        let fa = a.fullName.toLowerCase(),
        fb = b.fullName.toLowerCase();

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

}
