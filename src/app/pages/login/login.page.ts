import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, IonAccordionGroup, LoadingController } from '@ionic/angular';


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  constructor(
    private formBuilder: FormBuilder,
    private loadingController: LoadingController,
    private router: Router,
  ) { }

  ngOnInit() {
    this.setupLoginForm();
  }

  /**
   * Set Up Login Form
   */

  loginForm: FormGroup;
  setupLoginForm() {

    this.loginForm = this.formBuilder.group({
      username: ['admin1234', [Validators.required]],
      password: ['password', [Validators.required]],
    })
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
      await loading.present();
      await this.router.navigateByUrl('products');
  }

}
