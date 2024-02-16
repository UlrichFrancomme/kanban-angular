import {
  Directive,
  ElementRef,
  EmbeddedViewRef,
  HostListener,
  Input,
  OnDestroy,
  Renderer2,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';
import { Subject } from 'rxjs';

import { Overlay } from './overlay';

/**
 * MenuTrigger takes care of the creation of the menu and to add it into the DOM.
 * It also handles its positioning to always be visible in the viewport.
 *
 */
@Directive({ selector: '[menuTriggerFor]', standalone: true })
export class MenuTriggerDirective implements OnDestroy {
  @Input('menuTriggerFor') target!: TemplateRef<void>;
  @Input() asChild = false;

  private viewRef?: EmbeddedViewRef<void>;
  private unsubscribe$ = new Subject<void>();

  constructor(
    private elementRef: ElementRef<HTMLElement>,
    private vcr: ViewContainerRef,
    private renderer: Renderer2,
    private overlay: Overlay,
  ) {}

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  @HostListener('click')
  onClick() {
    if (!this.target) {
      return;
    }

    if (!this.viewRef || this.viewRef.destroyed) {
      this.viewRef = this.vcr.createEmbeddedView(this.target);

      const overlay = this.overlay.create();
      const parent = this.asChild ? this.elementRef.nativeElement : overlay;

      this.overlay.attach(this.viewRef);

      for (const node of this.viewRef.rootNodes) {
        this.renderer.appendChild(parent, node);
      }

      this.setMenuPosition(this.viewRef.rootNodes[0]);
    }
  }

  /**
   * A menu can be displayed :
   *  1. at the right of its trigger and open down (default)
   *  2. at the right of its trigger and open up, if there is no room to open down
   *  3. at the left of its trigger and open down, if 1. is not possible
   *  4. at the left of its trigger and open down, if 1. and 3. are not possible
   */
  private setMenuPosition(menu: HTMLElement): void {
    const trigger = this.elementRef.nativeElement;
    const triggerRect = trigger.getBoundingClientRect();

    const isChildOfTrigger = this.asChild;

    const menuWidth = menu.offsetWidth;
    const menuHeight = menu.offsetHeight;

    const viewportWidth = document.documentElement.offsetWidth;
    const viewportHeight = document.documentElement.offsetHeight;

    const enoughPlaceOnRight = viewportWidth - triggerRect.right > menuWidth;
    const enougthPlaceOnBottom = viewportHeight - triggerRect.bottom > menuHeight;

    this.renderer.setStyle(menu, 'position', 'absolute');

    if (enoughPlaceOnRight) {
      const left = isChildOfTrigger ? trigger.offsetWidth : triggerRect.right;
      this.renderer.setStyle(menu, 'left', `${left}px`);
    } else {
      const right = isChildOfTrigger ? trigger.offsetWidth : viewportWidth - triggerRect.left;
      this.renderer.setStyle(menu, 'right', `${right}px`);
    }

    if (enougthPlaceOnBottom) {
      const top = isChildOfTrigger ? 0 : triggerRect.top;
      this.renderer.setStyle(menu, 'top', `${top}px`);
    } else {
      const bottom = isChildOfTrigger ? 0 : viewportHeight - triggerRect.bottom;
      this.renderer.setStyle(menu, 'bottom', `${bottom}px`);
    }
  }
}
