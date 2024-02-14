import { BreakpointObserver } from '@angular/cdk/layout';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

export type Breakpoint = 'mobile' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl';

export const breakpoints: Record<Breakpoint, { min: string; range: string }> = {
  mobile: {
    min: '(min-width: 0px)',
    range: '(min-width: 0px) and (max-width: 639.98px)',
  },
  sm: {
    min: '(min-width: 640px)',
    range: '(min-width: 640px) and (max-width: 767.98px)',
  },
  md: {
    min: '(min-width: 768px)',
    range: '(min-width: 768px) and (max-width: 1023.98px)',
  },
  lg: {
    min: '(min-width: 1024px)',
    range: '(min-width: 1024px) and (max-width: 1279.98px)',
  },
  xl: {
    min: '(min-width: 1280px)',
    range: '(min-width: 1280px) and (max-width: 1535.98px)',
  },
  xxl: {
    min: '(min-width: 1536px)',
    range: '(min-width: 1536px) and (max-width: 639.98px)',
  },
};

export function toMediaQuery(breakpoint: Breakpoint, exactBreakpoint = false): string {
  return exactBreakpoint ? breakpoints[breakpoint].range : breakpoints[breakpoint].min;
}

@Injectable({ providedIn: 'root' })
export class BreakpointService {
  constructor(private observer: BreakpointObserver) {}

  isMatching(breakpoint: Breakpoint, only = false): Observable<boolean> {
    return this.observer
      .observe(toMediaQuery(breakpoint, only))
      .pipe(map((result) => result.matches));
  }
}
