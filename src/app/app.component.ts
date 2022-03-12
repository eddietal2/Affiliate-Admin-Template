import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, LoadingController, ToastController } from '@ionic/angular';
import { BehaviorSubject } from 'rxjs';
import { Storage } from '@ionic/storage';
import { LoginService } from './services/login/login.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { catchError, tap } from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt';


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit, AfterViewInit {
  TOKEN_KEY = 'access_token';
  authenticationState = new BehaviorSubject(false);
  user = null;
  userStayLoggedIn: any;
  loginModalOpen = true;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private helper: JwtHelperService,
    private toastController: ToastController,
    private alertController: AlertController,
    private storage: Storage,
    private loadingController: LoadingController,
    private loginService: LoginService,
  ) {
    this.initializeApp();
  }
  ngAfterViewInit(): void {
    this.activeLinks();
  }

  ngOnInit() {
    
  }


  initializeApp() {
    this.storage.create();
    this.checkToken();
    this.setupLoginForm();
    this.loginService.checkToken().then(() => {
      this.getAuthState();
    });
    this.router.events.subscribe(
      (event) => {
        
      }
    )

  }
  /**
   * Get the Client's Authentication State
   */
  getAuthState() {

    // State for the User. If Authentication State == False, the app reverts back to the landing page
    this.loginService.authenticationState.subscribe(async state => {
      if(state) {
        this.router.navigate(['products']);
      }
      else {
        this.router.navigate(['']);
      }
    });

  }


  /**
   * Set Up Login Form
   */

   loginForm: FormGroup;
   setupLoginForm() {
 
     this.loginForm = this.formBuilder.group({
       username: ['admin1234', [Validators.required]],
       password: ['12345678', [Validators.required]],
     })
   }


  goToPage(page) {
    this.router.navigateByUrl(page)
  }


  /**
   * Try Login
   */
   async tryLogin() {
    const loading = await this.loadingController.create({
      cssClass: 'login-loading',
      message: 'Logging ...',
      duration: 2000
    });
    await this.loginService.login(
      this.loginForm.controls.username.value,
      this.loginForm.controls.password.value,
      this.userStayLoggedIn).pipe(
        tap(res => {
          if (!res) {
            console.log('There was no response.');
          }
  
          if(this.userStayLoggedIn) {
            this.storage.set(this.TOKEN_KEY, res['token']);
            this.user = this.helper.decodeToken( res['token']);
          } 
        }),
        catchError(e => {
          console.error(e);
          if (e.error.msg === 'There was an error on the BackEnd') {
            this.loginErrorAlert('Incorrect Email/Password', 'The email and password don\'t match.');
          } else if (e.error.msg === 'The user does not exist') {
              this.loginErrorAlert('Nonexistent User Account', 'There is no account with that email address.');
          } else if (e.error.msg === 'Bad Password') {
            this.loginErrorAlert('Bad Password', 'The password you entered for this email is incorrect.'); 
          } else if (e.error.msg === 'You need to send email and password') {
            this.loginErrorAlert('Forgot Email or Password', 'Please include an Email or a Password'); 
          } else if (e.message.startsWith('Http failure response')) {
            this.loginErrorAlert('Server Connection Error', 'There was a problem connecting to the server. Please try again later.');
          } else {
            this.loginErrorAlert('Email/Password Error', 'Please try again.');
          }
          throw new Error(e);
        })
      )
      .subscribe(
        data => {
          console.log('Login was a success');
          this.loginSuccess(data);
        }
      );
}

stayLoggedIn(e) {
  console.log(e.detail);
  let checkBoxValue = e.detail;
  if(checkBoxValue) {
    this.userStayLoggedIn = true;
    return;
  } else {
    this.userStayLoggedIn = false;
    return;
  }
}
/**
 * 
 * @param header 
 * @param msg 
 */
async loginErrorAlert(header: string, msg: string) {
  const alert = await this.alertController.create({
    cssClass: 'danger-alert',
    header,
    message: msg,
    buttons: [{
      text: 'OK'
    }]
  });

  await alert.present();
}

async loginSuccess(data) {

  // Create Toast
  const toast = await this.toastController.create({
    message: 'You have successfully logged in!',
    cssClass: 'success-toast',
    duration: 3000,
  });

  // Create Loading
  const loading = await this.loadingController.create({
    cssClass: 'login-loading',
    message: 'Logging in ..',
    duration: 2000
  });

  this.authenticationState.next(true);
  this.loginModalOpen = false;
  this.router.navigateByUrl('/products');

  // console.log(data);
  
  return loading.present();
}


    /**  looks up our storage for a valid JWT and if found, changes our authenticationState
    */
    async checkToken() {
      console.log('Checking Token');
      this.storage.get(this.TOKEN_KEY).then(token => {
        if (token) {
          const decoded = this.helper.decodeToken(token);
          const isExpired = this.helper.isTokenExpired(token);
  
          // Check to see if token has expired.
          if (!isExpired) {
            this.user = decoded;
  
            if((decoded.email !== '')) {
              console.log('Decoded Token: ');            
              console.log(decoded);
              this.authenticationState.next(true);
            }
          } else {
            console.log('Token Removed from Storage');
            this.storage.remove(this.TOKEN_KEY);
          }
        }
      });
    }

  /**
   * Style Active Links for each Route
   */
  activeLinks() {

    let productLink = document.getElementById('products-link');
    let usersLink = document.getElementById('users-link');
    let reportsLink = document.getElementById('reports-link');
    let contactLink = document.getElementById('contact-link');
    let settingsLink = document.getElementById('settings-link');
    let menu = document.getElementById('menu');

    console.log(menu);
    

    if(this.router.url == '/products') {
      productLink.style.color = '#00c400';
      usersLink.style.color = '#dedede';
      reportsLink.style.color = '#dedede';
      settingsLink.style.color = '#dedede';
      contactLink.style.color = '#dedede';
      menu.style.opacity = '1';
    }
    if(this.router.url == '/users') {
      usersLink.style.color = '#00c400';
      productLink.style.color = '#dedede';
      reportsLink.style.color = '#dedede';
      settingsLink.style.color = '#dedede';
      contactLink.style.color = '#dedede';
      menu.style.opacity = '1';
    }
    if(this.router.url == '/reports') {
      reportsLink.style.color = '#00c400';
      productLink.style.color = '#dedede';
      usersLink.style.color = '#dedede';
      settingsLink.style.color = '#dedede';
      contactLink.style.color = '#dedede';
      menu.style.opacity = '1';
    }
    if(this.router.url == '/contact') {
      contactLink.style.color = '#00c400';
      reportsLink.style.color = '#dedede';
      productLink.style.color = '#dedede';
      usersLink.style.color = '#dedede';
      settingsLink.style.color = '#dedede';
      menu.style.opacity = '1';
    }
    if(this.router.url == '/settings') {
      settingsLink.style.color = '#00c400';
      productLink.style.color = '#dedede';
      usersLink.style.color = '#dedede';
      reportsLink.style.color = '#dedede';
      contactLink.style.color = '#dedede';
      menu.style.opacity = '1';
    }
    if(this.router.url == '/login') {
      settingsLink.style.color = '#dedede';
      productLink.style.color = '#dedede';
      usersLink.style.color = '#dedede';
      reportsLink.style.color = '#dedede';
      contactLink.style.color = '#dedede';
      console.log('I DID IT!!!');
      
      menu.style.opacity = '0';
    }

  }

  /**
   * Attempt to Logout, revealing Alert
   */
   async tryLogout() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Logout?',
      message: 'Are you sure you want to Logout?',
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
          text: 'Logout',
          id: 'confirm-button',
          handler: () => {

            this.storage.remove(this.TOKEN_KEY).then((token) => {
              console.log('Logging out...');
              this.user = null;
              window.location.reload();
              setTimeout(() => {
                this.authenticationState.next(false);
              }, 2000);
            });
          }
        }
      ]
    });

    await alert.present();

   }
}
