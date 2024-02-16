import { EmbeddedViewRef, Injectable, OnDestroy, Renderer2, RendererFactory2 } from '@angular/core';
import { BehaviorSubject, race, skip, Subject, takeUntil } from 'rxjs';

import { OutsideClickListener } from '../outside-click/outside-click.service';

/**
 * Overlay provides a container element for elements like Menu.
 *
 * It allows to handle backdrop click on these elements and dispose of them when they are not needed anymore.
 * The container element is destroyed when every attached elements are removed.
 */
@Injectable({ providedIn: 'root' })
export class Overlay implements OnDestroy {
  private renderer: Renderer2;
  private overlayInstance?: HTMLElement;

  private attachedViewRefs$ = new BehaviorSubject<Set<EmbeddedViewRef<unknown>>>(new Set());

  private unsubscribe$ = new Subject<void>();

  constructor(
    rendererFactory: RendererFactory2,
    private outsideClickListener: OutsideClickListener,
  ) {
    this.renderer = rendererFactory.createRenderer(undefined, null);
    /**
     * Destroy the container element when there is no more attached views.
     * We skip the first item as it is triggered when the service is created.
     **/
    this.attachedViewRefs$.pipe(skip(1), takeUntil(this.unsubscribe$)).subscribe((refs) => {
      if (refs.size === 0) {
        this.destroy();
      }
    });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  create(): Readonly<HTMLElement> {
    if (this.overlayInstance) {
      return this.overlayInstance;
    }

    this.overlayInstance = this.renderer.createElement('div') as HTMLElement;
    this.renderer.addClass(this.overlayInstance, 'overlay');
    this.renderer.appendChild(document.body, this.overlayInstance);

    return this.overlayInstance;
  }

  attach(viewRef: EmbeddedViewRef<unknown>): void {
    this.attachedViewRefs$.next(this.attachedViewRefs$.value.add(viewRef));
    this.handleClickOutsideOf(viewRef);
  }

  deattach(viewRef: EmbeddedViewRef<unknown>): void {
    const refs = this.attachedViewRefs$.value;
    refs.delete(viewRef);

    refs.forEach((ref) => {
      if ((viewRef.rootNodes[0] as HTMLElement).contains(ref.rootNodes[0])) {
        this.deattach(ref);
      }
    });

    this.attachedViewRefs$.next(refs);
    viewRef.destroy();
  }

  /**
   * Allow external components to dispose of the container and all its childrens
   */
  close(): void {
    this.attachedViewRefs$.value.forEach((ref) => ref.destroy());
    this.attachedViewRefs$.next(new Set());
    this.destroy();
  }

  private handleClickOutsideOf(viewRef: EmbeddedViewRef<unknown>) {
    const outsideClick$ = new Subject<void>();
    this.outsideClickListener
      .clickedOutsideOf(viewRef.rootNodes[0])
      .pipe(skip(1), takeUntil(race(outsideClick$, this.unsubscribe$)))
      .subscribe(() => {
        this.deattach(viewRef);
        outsideClick$.next();
        outsideClick$.complete();
      });
  }

  private destroy(): void {
    if (!this.overlayInstance) {
      return;
    }

    this.renderer.removeChild(document.body, this.overlayInstance);
    this.overlayInstance = undefined;
  }
}
