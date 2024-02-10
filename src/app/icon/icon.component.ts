import { Component, ElementRef, Input, OnChanges, Renderer2 } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Icon } from './icons';

@Component({
  selector: 'app-icon',
  standalone: true,
  template: '',
  styleUrls: ['./icon.component.scss'],
})
export class IconComponent implements OnChanges {
  @Input({ required: true }) icon!: Icon;

  constructor(
    private http: HttpClient,
    private elementRef: ElementRef<HTMLElement>,
    private renderer: Renderer2,
  ) {
  }

  ngOnChanges() {
    this.http.get(`assets/icons/${this.icon}.svg`, { responseType: 'text' })
      .subscribe(
        (element) => {
          this.renderer.setProperty(this.elementRef.nativeElement, 'innerHTML', element);
        }
      );
  }
}