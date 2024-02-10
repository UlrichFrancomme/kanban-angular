import { provideHttpClient, withFetch } from '@angular/common/http';
import { ɵprovideZonelessChangeDetection } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';

import { AppComponent } from './app/presentation/app.component';

bootstrapApplication(AppComponent, {
  providers: [ɵprovideZonelessChangeDetection(), provideHttpClient(withFetch())],
}).catch((err) => console.error(err));
