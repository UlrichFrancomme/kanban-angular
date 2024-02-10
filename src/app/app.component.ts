import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { TaskComponent } from './task/task.component';
import { ColumnComponent } from './column/column.component';

import { CdkDropListGroup } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: true,
  imports: [CdkDropListGroup, ColumnComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {

}
