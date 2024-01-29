import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgxLoadingModule } from 'ngx-loading';

import { AppComponent } from './app.component';
import { MapComponent, FilterComponent, ResultItemComponent, DialogComponent } from './components';

@NgModule({
  imports: [CommonModule, BrowserModule, HttpClientModule, FormsModule, NgxLoadingModule.forRoot({}), RouterModule.forRoot([], {useHash: true})],
  declarations: [AppComponent, MapComponent, FilterComponent, ResultItemComponent, DialogComponent],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
