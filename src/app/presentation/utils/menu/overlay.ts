import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import { BehaviorSubject, pairwise } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class Overlay {
  private renderer: Renderer2;
  private overlayInstance?: HTMLElement;

  private attachedElementsCount$ = new BehaviorSubject<number>(0);

  constructor(rendererFactory: RendererFactory2) {
    this.renderer = rendererFactory.createRenderer(undefined, null);
    this.attachedElementsCount$.pipe(pairwise()).subscribe(([previousCount, currentCount]) => {
      console.log({ previousCount, currentCount });
      if (previousCount > 0 && currentCount === 0) {
        this.destroy();
      }
    });
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

  attach(): void {
    this.attachedElementsCount$.next(this.attachedElementsCount$.value + 1);
  }

  deattach(): void {
    this.attachedElementsCount$.next(this.attachedElementsCount$.value - 1);
  }

  private destroy(): void {
    if (!this.overlayInstance) {
      return;
    }

    this.renderer.removeChild(document.body, this.overlayInstance);
    this.overlayInstance = undefined;
  }
}
