import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { MapComponent, FilterComponent, ResultItemComponent } from './components';

@NgModule({
  declarations: [
    AppComponent,
    MapComponent,
    FilterComponent,
    ResultItemComponent,
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
