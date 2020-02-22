import { Component, OnInit } from '@angular/core';
import { MaskService } from './service/mask.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  constructor(private $mask: MaskService) {}

  public menuToggle = false;

  ngOnInit(): void {
    this.$mask.getMask$.subscribe();
  }

  public toggleMenu() {
    this.menuToggle = !this.menuToggle;
  }
}
