/**
 * Gestion de la position :
 *    Un menu peut s'afficher :
 *      1. à droite du trigger et s'ouvrir vers le bas, position par défut)
 *      2. à droite du trigger et s'ouvrir vers le haut, si 1. ne tient pas dans le viewport)
 *      3. à gauche du trigger et s'ouvrir vers le bas, si 1. ne tient pas dans le viewport)
 *      4. à gauche du trigger et s'ouvrir vers le haut, si 1. et 3. ne tiennent pas dans le viewport)
 *
 * Sous menu :
 *    Un menu peut être composé de plusieurs sous menu.
 *    Le sous menu suit les mêmes règles de positionnement que le menu
 *
 * Backdrop click :
 *    Si un menu est ouvert et que l'utilisateur clique en dehors du menu, ce dernier (et tous ses sous menus) doit être fermé
 *
 */

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
import { skip, Subject, takeUntil } from 'rxjs';

import { Overlay } from './overlay';
import { OutsideClickListener } from '../outside-click/outside-click.service';

@Directive({ selector: '[menuTriggerFor]', standalone: true })
export class MenuTriggerDirective implements OnDestroy {
  @Input('menuTriggerFor') target!: TemplateRef<void>;
  @Input() asChild = false;

  private viewRef?: EmbeddedViewRef<void>;
  private unsubscribe$ = new Subject<void>();

  constructor(
    private elementRef: ElementRef<HTMLElement>,
    private vcr: ViewContainerRef,
    private outsideClickListener: OutsideClickListener,
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

    if (!this.viewRef) {
      this.viewRef = this.vcr.createEmbeddedView(this.target);

      let parent = this.elementRef.nativeElement;

      if (!this.asChild) {
        parent = this.overlay.create();
        this.overlay.attach();
      }

      for (const node of this.viewRef.rootNodes) {
        this.renderer.appendChild(parent, node);
      }

      const menu: HTMLElement = this.viewRef.rootNodes[0];

      this.setMenuPosition(menu);
      this.handleClickOutsideOfMenu(menu);
    }
  }

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

  private handleClickOutsideOfMenu(element: HTMLElement) {
    this.outsideClickListener
      .clickedOutsideOf(element)
      .pipe(skip(1), takeUntil(this.unsubscribe$))
      .subscribe(() => {
        this.destroy();
        this.unsubscribe$.next();
      });
  }

  private destroy() {
    this.viewRef?.destroy();
    this.viewRef = undefined;

    if (!this.asChild) {
      this.overlay.deattach();
    }
  }
}
