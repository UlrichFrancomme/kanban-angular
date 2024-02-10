import { ɵprovideZonelessChangeDetection } from '@angular/core';
import { AppComponent } from './app/app.component';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient, withFetch } from '@angular/common/http';

bootstrapApplication(AppComponent, {
  providers: [
    ɵprovideZonelessChangeDetection(),
    provideHttpClient(withFetch())
  ]
})
  .catch(err => console.error(err));
