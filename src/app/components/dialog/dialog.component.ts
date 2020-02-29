import { Component, OnInit, Input } from '@angular/core';
import { IGeoJson } from 'src/app/interface';
import { MaskService } from 'src/app/service/mask.service';
import * as moment from 'moment';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss']
})
export class DialogComponent implements OnInit {
  @Input() overlay: IGeoJson;

  public moment = moment;

  public coordinates = this.overlay?.geometry?.coordinates ?? [];
  public mapLatLng = `${this.coordinates[1]},${this.coordinates[0]}`;

  public heads = ['時段', '一', '二', '三', '四', '五', '六', '日'];
  public servicePeriods = [
    { periodName: '上午', periods: [] },
    { periodName: '下午', periods: [] },
    { periodName: '晚上', periods: [] }
  ];

  constructor(private $mask: MaskService) {}

  ngOnInit(): void {
    if (this.overlay?.properties?.service_periods) {
      const periods = this.overlay?.properties?.service_periods.split('');
      periods.forEach((period, indx) => {
        const ceilPlace = Math.ceil((indx + 1) / 7);
        this.servicePeriods[ceilPlace - 1].periods.push(period === 'N');
      });
    }
  }

  public close(e: Event) {
    e.stopPropagation();
    const target = e.target as HTMLDivElement;
    if (target.className !== 'Dialog__Container') {
      return;
    }
    this.$mask.overlay.next(null);
  }

  public trackByFn(index: number) {
    return index;
  }
}
