import { Injectable } from '@angular/core';
import { Subject, ReplaySubject } from 'rxjs';
import { IFilter, IMaskModel, IGeoJson } from '../interface';
import { switchMap, scan, map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { FILTER, TAB_OPTION } from '../default';

@Injectable({
  providedIn: 'root'
})
export class MaskService {
  constructor(private http: HttpClient) {}

  private filter: Subject<IFilter> = new ReplaySubject(1);

  public filter$ = this.filter.asObservable().pipe(
    scan((previous: IFilter, current: IFilter) => ({
      ...previous,
      ...current
    }))
  );

  private allMask: Subject<IGeoJson[]> = new ReplaySubject(1);
  public allMask$ = this.allMask.asObservable();

  public getMask$ = this.filter$.pipe(
    switchMap((params: IFilter) =>
      this.allMask$.pipe(
        map(allData => {
          if (params.searchText) {
            return allData.filter(
              data => data.properties.address.includes(params.searchText) || data.properties.name.includes(params.searchText)
            );
          } else {
            const nearestList = this.filterTabMask(params, this.nearestCity(allData, params.lat, params.lng));
            this.count.next(nearestList.length);
            return nearestList;
          }
        }),
        map(allData => allData.filter((data, indx) => indx >= 0 && indx < params.page * params.per))
      )
    )
  );

  private count = new Subject();
  public count$ = this.count.asObservable();

  public overlay: Subject<IGeoJson> = new Subject();
  public overlay$ = this.overlay.asObservable();

  private filterTabMask(params: IFilter, allData: IGeoJson[]) {
    if (!params.tab) {
      return allData;
    }
    const tab = TAB_OPTION[params.tab];
    return allData.filter(data => data.properties[tab] > 0);
  }

  public getMaskData() {
    return this.http.get(`https://raw.githubusercontent.com/kiang/pharmacies/master/json/points.json`).pipe(
      map((res: IMaskModel) => {
        const results = res.features.map(f => ({ ...f })) as IGeoJson[];
        results.forEach(r => {
          if (r.properties.updated) {
            r.properties.updated = new Date(r.properties.updated);
          }
        });
        this.allMask.next(results);
      })
    );
  }

  private deg2Rad = (deg: number) => (deg * Math.PI) / 180;

  private pythagorasEquirectangular(lat1: number, lng1: number, lat2: number, lng2: number) {
    const R = 6371; // Radius of the earth in km
    const dLat = this.deg2Rad(lat2 - lat1); // deg2rad below
    const dLon = this.deg2Rad(lng2 - lng1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2Rad(lat1)) * Math.cos(this.deg2Rad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c; // Distance in km
    return d;
  }

  private nearestCity(geoDatas: IGeoJson[], latitude: number, longitude: number) {
    const mindif = 1.5;
    return geoDatas.filter(geoData => {
      const dif = this.pythagorasEquirectangular(latitude, longitude, geoData.geometry.coordinates[1], geoData.geometry.coordinates[0]);
      return dif < mindif;
    });
  }

  public inital(param: IFilter) {
    this.setFilter({ ...FILTER, ...param });
  }

  public setFilter(param: IFilter) {
    this.filter.next(param);
  }
}
