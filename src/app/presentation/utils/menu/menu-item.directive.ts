import { Directive, Host, HostListener, Optional } from '@angular/core';

import { MenuTriggerDirective } from './menu-trigger.directive';
import { Overlay } from './overlay';

/**
 * MenuItem takes care of closing the parent overlay container when clicked.
 * If the MenuItem is also a MenuTrigger, this behavior is not applied
 */
@Directive({ selector: '[menuItem]', standalone: true })
export class MenuItemDirective {
  private isTrigger = false;

  constructor(
    private overlay: Overlay,
    @Optional() @Host() menuTrigger: MenuTriggerDirective,
  ) {
    this.isTrigger = !!menuTrigger;
  }

  @HostListener('click')
  private onClick(): void {
    if (this.isTrigger) {
      return;
    }
    this.overlay.close();
  }
}
