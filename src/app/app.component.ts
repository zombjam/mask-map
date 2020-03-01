import { Component, OnInit, OnDestroy } from '@angular/core';
import { MaskService } from './service/mask.service';
import { timer, Subject } from 'rxjs';
import { takeUntil, map, take } from 'rxjs/operators';
import { ngxLoadingAnimationTypes } from 'ngx-loading';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  constructor(public $mask: MaskService) {}

  public menuToggle = false;

  public map: L.Map;

  private onDestroy = new Subject();
  private onDestroy$ = this.onDestroy.asObservable();

  public loading$ = timer(0, 4500).pipe(
    map(v => v === 0),
    take(2)
  );

  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;

  ngOnInit(): void {
    timer(0, 300000)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(() => {
        this.$mask.getMaskData().subscribe();
      });
  }

  ngOnDestroy(): void {
    this.onDestroy.next('');
  }

  public toggleMenu() {
    this.menuToggle = !this.menuToggle;
  }

  public setMap(event) {
    setTimeout(() => {
      this.map = event;
    }, 0);
  }
}
