import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { TaskComponent } from './task/task.component';
import { ColumnComponent } from './column/column.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: true,
  imports: [ColumnComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {

}
