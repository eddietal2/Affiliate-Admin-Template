import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { tap, catchError } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';
import { AlertController, ToastController, LoadingController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  BACKEND_URL = environment.url;
  TOKEN_KEY = 'access_token';
  authenticationState = new BehaviorSubject(false);
  user = null;

  constructor(
    private http: HttpClient,
    private storage: Storage,
    private router: Router,
    private helper: JwtHelperService,
    private alertController: AlertController,
    private toastController: ToastController,
    private loadingController: LoadingController) 
    { }

    /**
     * Admin Login
     * @returns 
     */
    login(username: string, password: string, userStayLoggedIn) {
      console.log('Attempting to Log In:');
      
      return this.http.post(`${this.BACKEND_URL}/auth/login`, {username, password})
      
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
  
}
