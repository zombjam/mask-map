import { Component, OnInit, Input } from '@angular/core';
import * as moment from 'moment';
import { MaskService } from 'src/app/service/mask.service';
import { IGeoJson, IFilter } from 'src/app/interface';
import { MarkerService } from 'src/app/service/marker.service';
import { filter, take, debounce, debounceTime } from 'rxjs/operators';
import * as L from 'leaflet';
import { TAB_GROUP, TAB_OPTION } from 'src/app/default';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss']
})
export class FilterComponent implements OnInit {
  @Input() map: L.Map;
  public moment = moment;
  public weekDay = moment().weekday();

  public TAB_GROUP = Object.values(TAB_GROUP);

  private keyEvent: Subject<string> = new Subject();

  private searchFilter: IFilter;

  constructor(public $mask: MaskService, private $marker: MarkerService) {}

  ngOnInit(): void {
    moment.locale(navigator.language);
    this.keyEvent.pipe(debounceTime(500)).subscribe(searchText => {
      console.log('searchText: ', searchText);
      this.$mask.setFilter({ ...this.searchFilter, searchText });
    });
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
    this.$marker
      .markers$(geoData.properties.id)
      .pipe(
        filter(mrk => mrk != null),
        take(1)
      )
      .subscribe(marker => {
        marker.getPopup().openOn(this.map);
        if (this.map.getZoom() < 16) {
          const cooredinate = new L.LatLng(geoData.geometry.coordinates[1], geoData.geometry.coordinates[0]);
          this.map.setView(cooredinate, 16);
        }
      });
  }

  public setTab(params: IFilter, tab: 0 | 1 | 2) {
    this.$mask.setFilter({ ...params, tab });
  }

  public setSearchText(params: IFilter, searchText: string) {
    this.searchFilter = params;
    this.keyEvent.next(searchText);
  }
}
