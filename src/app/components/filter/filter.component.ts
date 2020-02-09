import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss']
})
export class FilterComponent implements OnInit {

  public moment = moment;

  public weekDay = moment().weekday();
  constructor() { }

  ngOnInit(): void {
    moment.locale(navigator.language);
  }

}
