import { Injectable } from '@angular/core';
import { filter, fromEvent, Observable, shareReplay } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class OutsideClickListener {
  private outsideObserver!: Observable<PointerEvent>;

  constructor() {
    this.outsideObserver = fromEvent<PointerEvent>(document, 'click');
  }

  clickedOutsideOf(element: HTMLElement): Observable<PointerEvent> {
    return this.outsideObserver.pipe(
      shareReplay(),
      filter((event) => !element.contains(event.target as Node)),
    );
  }
}
