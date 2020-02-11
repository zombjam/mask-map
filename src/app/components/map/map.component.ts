import { Component, OnInit, AfterViewInit } from '@angular/core';
import * as L from 'leaflet';
import 'leaflet.markercluster';
import { MarkerService } from 'src/app/service/marker.service';


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

  private markers: L.MarkerClusterGroup;
  constructor(
    private $marker: MarkerService
  ) { }

  ngOnInit(): void {
    this.initGeolocation();
  }

  ngAfterViewInit(): void {
    this.initMap();
    this.initMakers();
  }

  private initMap() {
    if (!this.loading) {
      this.map = L.map('map', {
        zoomControl: false
      });
      // tileLayer scheme source: http://leaflet-extras.github.io/leaflet-providers/preview/
      const tiles = L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        attribution: `&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>
        contributors &copy; <a href="https://carto.com/attributions">CARTO</a>`,
        maxZoom: 16
      });

      this.markers = L.markerClusterGroup().addTo(this.map);
      tiles.addTo(this.map);

      L.control.zoom({
        position: 'bottomright'
      }).addTo(this.map);

    }
  }

  private initGeolocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position: Position) => {
        this.lat = position.coords.latitude;
        this.lng = position.coords.longitude;
        this.map.setView(new L.LatLng(this.lat, this.lng), this.zoomValue);
        console.log('this.lat: ', this.lat);
        console.log('this.lng: ', this.lng);

        this.markers.addLayer(
          L.marker([this.lat, this.lng], { icon: this.$marker.defaultIcon}).addTo(this.map)
          .bindTooltip('You', {
            direction: 'top',
            offset: L.point(0, -8),
            permanent: true
          })
          .openTooltip()
        );

      }, (fail) => {
        console.log(fail);
      });
      this.initMap();
    }
    this.loading = false;
  }

  private initMakers() {
    const data = [
      { name: '軟體園區', lat: 24.937244, lng: 121.354644 },
      { name: 'ikea', lat: 24.935094, lng: 121.355620 }
    ];
    for (let i = 0; data.length > i; i++) {
      this.markers.addLayer(
        L.marker([data[i].lat, data[i].lng], { icon: this.$marker.redIcon }).addTo(this.map)
      );
    }
    this.map.addLayer(this.markers);
  }

  private generateCircleMarkers(lat: number, lng: number) {
    L.circleMarker([lat, lng]).addTo(this.map);
  }

}
