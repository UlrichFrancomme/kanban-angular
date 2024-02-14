import { Directive, Input, OnDestroy, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';

import { Breakpoint, BreakpointService } from './breakpoint.service';

@Directive({ selector: '[breakpoint]', standalone: true })
export class BreakpointDirective implements OnInit, OnDestroy {
  @Input({ required: true }) breakpoint!: Breakpoint;
  @Input() breakpointOnly = false;

  private unsubscribe$ = new Subject<void>();

  constructor(
    private breakpointService: BreakpointService,
    private vcr: ViewContainerRef,
    private templateRef: TemplateRef<Element>,
  ) {}

  ngOnInit(): void {
    this.breakpointService
      .isMatching(this.breakpoint, this.breakpointOnly)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((isMatching) =>
        isMatching ? this.vcr.createEmbeddedView(this.templateRef) : this.vcr.clear(),
      );
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
