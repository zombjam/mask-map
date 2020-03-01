import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { IGeoJson } from 'src/app/interface';
import { MaskService } from 'src/app/service/mask.service';
import { TAB_OPTION } from 'src/app/default';

@Component({
  selector: 'app-result-item',
  templateUrl: './result-item.component.html',
  styleUrls: ['./result-item.component.scss']
})
export class ResultItemComponent implements OnInit {
  @Input() geoData: IGeoJson;
  @Input() selectTab: 0 | 1 | 2;

  @Output() clickEvent = new EventEmitter();

  constructor(private $mask: MaskService) {}

  ngOnInit(): void {}

  public getMaskLevel() {
    if (this.geoData?.properties?.mask_adult === 0 || this.geoData?.properties?.mask_child === 0) {
      return;
    }
    const totalCount = this.geoData?.properties?.mask_adult + this.geoData?.properties?.mask_child;
    if (totalCount > 200) {
      return 'Result--high';
    } else if (totalCount > 100 && totalCount < 200) {
      return 'Result--medium';
    } else if (totalCount > 0 && totalCount < 100) {
      return 'Result--low';
    }
  }

  public openInfoOverlay(e: Event) {
    e.stopPropagation();
    this.$mask.overlay.next(this.geoData);
  }

  public openDetailMap(e: Event) {
    e.stopPropagation();
    this.clickEvent.emit();
  }

  public filerTab() {
    if (!this.selectTab) {
      return true;
    }
    return this.geoData.properties[TAB_OPTION[this.selectTab]] > 0;
  }
}
