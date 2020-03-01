import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { MapComponent, FilterComponent, ResultItemComponent, DialogComponent } from './components';

@NgModule({
  declarations: [AppComponent, MapComponent, FilterComponent, ResultItemComponent, DialogComponent],
  imports: [BrowserModule, HttpClientModule, FormsModule],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
