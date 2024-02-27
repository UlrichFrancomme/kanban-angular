import { CdkDropListGroup } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';

import { ColumnComponent } from '../column/column.component';
import { SearchComponent } from '../search/search.component';
import { BreakpointService } from '../utils/breakpoint/breakpoint.service';

@Component({
  selector: 'app-board',
  standalone: true,
  imports: [CommonModule, CdkDropListGroup, ColumnComponent, SearchComponent],
  templateUrl: './board.component.html',
  styleUrl: './board.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BoardComponent {
  isLargeScreen = toSignal(this.breakpointService.isMatching('lg'));

  constructor(private breakpointService: BreakpointService) {}
}
