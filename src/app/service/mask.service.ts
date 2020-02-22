import { Injectable } from '@angular/core';
import { Subject, ReplaySubject, Observable } from 'rxjs';
import { IFilter, MaskModel, GeoJson } from '../interface';
import { switchMap, tap, scan, map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MaskService {
  constructor(private http: HttpClient) {}

  public filter: Subject<IFilter> = new Subject();

  public filter$ = this.filter
    .asObservable()
    .pipe(
      scan((previous: IFilter, current: IFilter) => ({
        ...previous,
        ...current
      }))
    );

  public getMask$ = this.filter$.pipe(
    switchMap(() => this.getMaskData()),
    tap(_ => console.log(_))
  );

  private getMaskData(): Observable<GeoJson[]> {
    return this.http
      .get(
        `https://raw.githubusercontent.com/kiang/pharmacies/master/json/points.json`
      )
      .pipe(map((res: MaskModel) => res.features));
  }

  public inital(param: IFilter) {
    this.filter.next({ ...param });
  }
}
