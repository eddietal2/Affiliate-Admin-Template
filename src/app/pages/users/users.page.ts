import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { UsersService } from 'src/app/services/users/users.service';
import { AlertController, LoadingController, IonAccordionGroup } from '@ionic/angular';

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
  ) { 
  }

  ngOnInit() {
    this.usersService.getAllUsers().subscribe(
      users => {
        this.allUsers = Object.values(users);
        console.log(this.allUsers);
      }
    )
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

}
