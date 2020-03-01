import { Injectable } from '@angular/core';
import * as L from 'leaflet';
import { ReplaySubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { IGeoJson } from '../interface';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class MarkerService {
  constructor() {
    this.initMarkerIcons();
  }

  public defaultIcon: L.Icon;
  public greenIcon: L.Icon;
  public orangeIcon: L.Icon;
  public redIcon: L.Icon;

  public markers: ReplaySubject<L.Marker[]> = new ReplaySubject(1);
  public markers$ = (id: number) => this.markers.asObservable().pipe(map(markers => markers.find(m => m.options.title === `marker-${id}`)));

  private initMarkerIcons() {
    const defaultRetinaUrl = 'assets/marker-icon-2x.png';
    const iconUrl = 'assets/marker-icon.png';
    const shadowUrl = 'assets/marker-shadow.png';
    this.defaultIcon = L.icon({
      iconUrl,
      shadowUrl,
      iconRetinaUrl: defaultRetinaUrl,
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      tooltipAnchor: [16, -28]
    });

    this.greenIcon = this.generateCustomIcons('green');
    this.orangeIcon = this.generateCustomIcons('orange');
    this.redIcon = this.generateCustomIcons('red');
  }

  private generateCustomIcons(color: string): L.Icon {
    return L.icon({
      iconUrl: `assets/icon/Icon_location_${color}.png`,
      iconSize: [39, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      tooltipAnchor: [16, -28]
    });
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
  public setPopupContent(geoData: IGeoJson) {
    const info = geoData.properties;
    const coordinates = geoData.geometry.coordinates;
    const mapLatLng = `${coordinates[1]},${coordinates[0]}`;
    return `
          <div class="popup-title">
            <span class="title">${info.name}</span>
            <span>${info.address}</span>
            <span>連絡電話 | ${info.phone}</span>
            <span class="info ${'info-' + info.id}"><span>營業資訊</span><i class="material-icons">info</i></span>
            ${info.updated ? `<span class="update">資訊更新於 ${moment(info.updated).fromNow()}</span>` : ''}
          </div>
          ${this.getMaskDetailTemplate(geoData)}
          <div class="popup-btn">
            <a target="_blank"
            href="https://www.google.com/maps/dir/?api=1&destination=${mapLatLng}//${info.name}">Google 路線導航</a>
          </div>
      `;
  }
}
