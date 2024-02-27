import { Directive, ElementRef, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';

import { OutsideClickListener } from './outside-click.service';

@Directive({ selector: '[outsideClick]', standalone: true })
export class OutsideClickDirective implements OnInit, OnDestroy {
  @Output() outsideClick = new EventEmitter<void>();

  private unsubscribe$ = new Subject<void>();

  constructor(
    private elementRef: ElementRef<HTMLElement>,
    private listener: OutsideClickListener,
  ) {}

  ngOnInit(): void {
    this.listener
      .clickedOutsideOf(this.elementRef.nativeElement)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(() => this.outsideClick.emit());
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
