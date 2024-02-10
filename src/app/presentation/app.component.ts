import { CdkDropListGroup } from '@angular/cdk/drag-drop';
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ColumnComponent } from './column/column.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: true,
  imports: [CdkDropListGroup, ColumnComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {}
