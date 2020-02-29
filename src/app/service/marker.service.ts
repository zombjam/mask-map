import { Injectable } from '@angular/core';
import * as L from 'leaflet';
import { ReplaySubject } from 'rxjs';
import { map } from 'rxjs/operators';

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
}
