import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  public menuToggle = false;

  public toggleMenu() {
    this.menuToggle = !this.menuToggle;
  }
}
