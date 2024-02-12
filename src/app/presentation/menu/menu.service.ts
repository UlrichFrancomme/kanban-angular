import {
  ComponentRef,
  Injectable,
  Renderer2,
  RendererFactory2,
  ViewContainerRef,
} from '@angular/core';

import { MenuComponent } from './menu.component';
import { Task } from '../../core';

type Position = {
  top: number;
  left: number;
  right: number;
};

@Injectable({ providedIn: 'root' })
export class MenuService {
  private renderer: Renderer2;
  private menuInstance?: ComponentRef<MenuComponent>;
  private hostContainerRef?: ViewContainerRef;

  constructor(rendererFactory: RendererFactory2) {
    this.renderer = rendererFactory.createRenderer(undefined, null);
  }

  /**
   * @param vcr ViewContainerRef of the element in which the MenuComponent will be created
   *            It should be set before calling to openMenu
   */
  initHostContainerRef(vcr: ViewContainerRef): void {
    if (!this.hostContainerRef) {
      this.hostContainerRef = vcr;
    }
  }

  /**
   * Create a MenuComponent and attach it to the host ViewContainerRef.
   * The taskId is passed to the component instance and the element is positioned on the menu trigger button.
   *
   * If called when there is already a MenuComponent opened, the existing one is removed.
   *
   * @param task task for which the menu is opened
   * @param position Position of the menu trigger on the task component relative to the viewport
   *
   */
  openMenu(task: Task, position: Position): void {
    if (!this.hostContainerRef) {
      return;
    }

    if (this.menuInstance) {
      this.closeMenu();
    }

    this.menuInstance = this.hostContainerRef?.createComponent(MenuComponent);
    this.menuInstance.instance.task = task;

    this.setMenuPosition(position);
  }

  closeMenu() {
    this.menuInstance?.destroy();
    this.menuInstance = undefined;
  }

  private setMenuPosition(position: Position): void {
    if (!this.menuInstance) {
      return;
    }

    const element: HTMLElement = this.menuInstance.location.nativeElement;

    this.renderer.setStyle(element, 'top', `${position.top}px`);

    const viewportWidth = document.documentElement.clientWidth;
    const elementWidth = element.clientWidth;

    if (position.left + elementWidth > viewportWidth) {
      this.renderer.setStyle(element, 'right', `${viewportWidth - position.right}px`);
    } else {
      this.renderer.setStyle(element, 'left', `${position.left}px`);
    }
  }
}
