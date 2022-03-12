import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ReportsService } from 'src/app/services/reports/reports.service';
ReportsService

@Component({
  selector: 'app-reports',
  templateUrl: './reports.page.html',
  styleUrls: ['./reports.page.scss'],
})
export class ReportsPage implements OnInit, OnDestroy {
  reportsSub: Subscription;

  constructor(
    private reportsService: ReportsService
  ) { }

  ngOnInit() {
    this.reportsSub = this.reportsService.getAllReports().subscribe(
      reports => {
        console.log(reports);
        
      }
    )
  }
  
  @HostListener('unloaded')
  ngOnDestroy() {
    this.reportsSub.unsubscribe();
  }

}
