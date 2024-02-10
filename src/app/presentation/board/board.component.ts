import { CdkDropListGroup } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, ViewContainerRef } from '@angular/core';

import { ColumnComponent } from '../column/column.component';
import { MenuService } from '../menu/menu.service';

@Component({
  selector: 'app-board',
  standalone: true,
  imports: [CommonModule, CdkDropListGroup, ColumnComponent],
  templateUrl: './board.component.html',
  styleUrl: './board.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BoardComponent {
  constructor(menuService: MenuService, viewContainerRef: ViewContainerRef) {
    menuService.initHostContainerRef(viewContainerRef);
  }
}
