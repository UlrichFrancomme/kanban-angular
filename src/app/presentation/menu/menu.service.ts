import {
  ComponentRef,
  Injectable,
  Renderer2,
  RendererFactory2,
  ViewContainerRef,
} from '@angular/core';

import { MenuComponent } from './menu.component';

type Position = {
  top: number;
  left: number;
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
   * @param taskId ID of the task for which the menu is opened
   * @param position Position of the menu trigger on the task component relative to the viewport
   *
   */
  openMenu(taskId: string, position: Position): void {
    if (!this.hostContainerRef) {
      return;
    }

    if (this.menuInstance) {
      this.closeMenu();
    }

    this.menuInstance = this.hostContainerRef?.createComponent(MenuComponent);
    this.menuInstance.instance.taskId = taskId;
    const element = this.menuInstance.location.nativeElement;
    this.renderer.setStyle(element, 'top', `${position.top}px`);
    this.renderer.setStyle(element, 'left', `${position.left}px`);
  }

  closeMenu() {
    this.menuInstance?.destroy();
    this.menuInstance = undefined;
  }
}
