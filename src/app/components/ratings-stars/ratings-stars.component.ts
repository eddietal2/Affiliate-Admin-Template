import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-ratings-stars',
  templateUrl: './ratings-stars.component.html',
  styleUrls: ['./ratings-stars.component.scss'],
})
export class RatingsStarsComponent implements OnInit {

  @Input('rating') rating;

  constructor() { }

  ngOnInit() {
    // console.log(this.rating);
  }

}
