import { ChangeDetectorRef, Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {

  constructor(
    public changeDetectorRef: ChangeDetectorRef,
  ) { }

  ngOnInit() {
    this.triggerSkeletonView();
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

}
