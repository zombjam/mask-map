import { Component, OnInit, Input } from '@angular/core';
import * as moment from 'moment';
import { MaskService } from 'src/app/service/mask.service';
import { IGeoJson } from 'src/app/interface';
import { MarkerService } from 'src/app/service/marker.service';
import { filter, take } from 'rxjs/operators';
import * as L from 'leaflet';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss']
})
export class FilterComponent implements OnInit {
  @Input() map: L.Map;
  public moment = moment;
  public weekDay = moment().weekday();

  constructor(public $mask: MaskService, private $marker: MarkerService) {}

  ngOnInit(): void {
    moment.locale(navigator.language);
  }

  public trackByFn(index: number) {
    return index;
  }

  public onScroll(e: Event, { params, allCount }) {
    const target = e.target as HTMLDivElement;
    if (params.per * params.page > allCount) {
      return;
    }
    const top = target.scrollTop;
    const height = target.scrollHeight;
    if ((top / height) * 100 > 40) {
      this.$mask.setFilter({ ...params, page: params.page += 1 });
    }
  }

  public openDetail(geoData: IGeoJson) {
    if (!geoData || !geoData.properties || !geoData.geometry.coordinates) {
      return;
    }
    const cooredinate = new L.LatLng(geoData.geometry.coordinates[1], geoData.geometry.coordinates[0]);
    this.$marker
      .markers$(geoData.properties.id)
      .pipe(
        filter(mrk => mrk != null),
        take(1)
      )
      .subscribe(marker => {
        this.map.setView(cooredinate, 16);
        marker.addTo(this.map).openPopup();
      });
  }
}
