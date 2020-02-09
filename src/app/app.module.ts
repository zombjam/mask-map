import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { MapComponent, FilterComponent, AddressItemComponent } from './components';

@NgModule({
  declarations: [
    AppComponent,
    MapComponent,
    FilterComponent,
    AddressItemComponent,
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
