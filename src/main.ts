import { ɵprovideZonelessChangeDetection } from '@angular/core';
import { AppComponent } from './app/app.component';
import { bootstrapApplication } from '@angular/platform-browser';

bootstrapApplication(AppComponent, {
  providers: [ɵprovideZonelessChangeDetection()]
})
  .catch(err => console.error(err));
