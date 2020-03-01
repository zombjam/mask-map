import { Component, OnInit, AfterViewInit, Output, EventEmitter } from '@angular/core';
import * as L from 'leaflet';
import 'leaflet.markercluster';
import * as moment from 'moment';
import { MarkerService } from 'src/app/service/marker.service';
import { MaskService } from 'src/app/service/mask.service';
import { IFilter, IGeoJson } from 'src/app/interface';
import { Subject } from 'rxjs';
import { takeUntil, take } from 'rxjs/operators';
import { FILTER } from 'src/app/default';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit, AfterViewInit {
  public loading = true;
  public lat: number;
  public lng: number;
  public zoomValue = 16;

  public map: L.Map;

  @Output() mapEmit = new EventEmitter();

  private markers: L.MarkerClusterGroup;

  private filter: IFilter;
  private onDestroy = new Subject();
  private onDestroy$ = this.onDestroy.asObservable();

  constructor(private $marker: MarkerService, private $mask: MaskService) {}

  ngOnInit(): void {
    this.initGeolocation();

    this.$mask.filter$.pipe(takeUntil(this.onDestroy$)).subscribe(filter => (this.filter = filter));

    this.$mask.allMask$.pipe(take(1)).subscribe(allData => this.initMakers(allData));
  }

  ngAfterViewInit(): void {
    this.initMap();
  }

  private initMap() {
    if (!this.loading) {
      this.map = L.map('map', {
        zoomControl: false,
        dragging: true,
        tap: true
      });

      this.mapEmit.emit(this.map);
      // tileLayer scheme source: http://leaflet-extras.github.io/leaflet-providers/preview/
      const tiles = L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        attribution: `&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>
        contributors &copy; <a href="https://carto.com/attributions">CARTO</a>`,
        maxZoom: 16
      });

      this.markers = L.markerClusterGroup().addTo(this.map);
      tiles.addTo(this.map);

      L.control
        .zoom({
          position: 'bottomright'
        })
        .addTo(this.map);

      this.map.on('moveend', e => {
        const updateCenter = this.map.getBounds().getCenter();
        this.lat = updateCenter.lat;
        this.lng = updateCenter.lng;
        if (this.filter) {
          if (this.filter?.page > FILTER.page) {
            this.updatePosition(FILTER.page);
          } else {
            this.updatePosition();
          }
        }
      });
    }
  }

  private updatePosition(page?: number) {
    this.$mask.setFilter({
      ...this.filter,
      page: page ?? this.filter.page,
      lat: this.lat,
      lng: this.lng
    });
  }

  private initGeolocation() {
    if (navigator?.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position: Position) => {
          this.lat = position.coords.latitude;
          this.lng = position.coords.longitude;
          this.map.setView(new L.LatLng(this.lat, this.lng), this.zoomValue);

          this.$mask.inital({ lat: this.lat, lng: this.lng } as IFilter);
          this.markers.addLayer(
            L.marker([this.lat, this.lng], { icon: this.$marker.defaultIcon })
              .addTo(this.map)
              .bindTooltip('目前位置', {
                direction: 'top',
                offset: L.point(0, -8),
                permanent: true
              })
              .openTooltip()
          );
        },
        fail => {
          console.log(fail);
        }
      );
      this.initMap();
    }
    this.loading = false;
  }

  private initMakers(makersData: IGeoJson[]) {
    if (!makersData?.length) {
      return;
    }
    const cluster = new L.MarkerClusterGroup();
    this.map.addLayer(cluster);

    const allMarkers = [] as L.Marker[];

    makersData.forEach(data => {
      const info = data.properties;
      const markerIcon = this.setMarkerIconStyle(data);
      const position = new L.LatLng(data.geometry.coordinates[1], data.geometry.coordinates[0]);
      const itemPop = L.popup({ minWidth: 240 }).setLatLng(position);

      const mrks = L.marker(position, { icon: markerIcon, title: `marker-${info.id}` });
      cluster.addLayer(mrks);
      mrks
        .bindPopup(itemPop)
        .on('click', () => {
          itemPop.setContent(this.$marker.setPopupContent(data)).update();
        })
        .on('popupopen', () => {
          const infoEle = document.querySelector(`.info-${info.id}`);
          if (infoEle) {
            infoEle.addEventListener('click', e => this.openInfoOverlay(data, e));
          }
        });
      allMarkers.push(mrks);
    });
    this.$marker.markers.next(allMarkers as any);
  }

  private setMarkerIconStyle(data: IGeoJson) {
    const totalCount = data.properties.mask_adult + data.properties.mask_child;
    if (totalCount > 200) {
      return this.$marker.greenIcon;
    } else if (totalCount > 100 && totalCount < 200) {
      return this.$marker.orangeIcon;
    } else {
      return this.$marker.redIcon;
    }
  }

  private getMaskDetailTemplate(data: IGeoJson) {
    const info = data.properties;
    if (info.updated) {
      return `
        <div class="popup-label">
          <span class="adult">成人口罩 ${info.mask_adult}個</span>
          <span class="child">兒童口罩 ${info.mask_child}個</span>
        </div>
      `;
    } else {
      return `
        <div class="popup-error">
          <span><i class="material-icons">info_outline</i>無法取得即時資料</span>
          <span>* 中央健保署的資料似乎有問題，請電洽藥局。</span>
        </div>
      `;
    }
  }

  public openInfoOverlay(data: IGeoJson, e?: Event) {
    e?.stopPropagation();
    this.$mask.overlay.next(data);
  }
}
