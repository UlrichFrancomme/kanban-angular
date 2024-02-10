import { CdkDragDrop, DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, Signal } from '@angular/core';
import { Status, Task } from '../core/task';
import { TaskComponent } from '../task/task.component';
import { TasksStore } from '../core/tasks.store';

@Component({
  selector: 'app-column',
  standalone: true,
  imports: [CommonModule, DragDropModule, TaskComponent],
  templateUrl: './column.component.html',
  styleUrl: './column.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ColumnComponent {
  @Input({ required: true }) status!: Status;
  tasks!: Signal<Task[]>;

  constructor(private store: TasksStore) {
  }

  ngOnInit() {
    this.tasks = this.store.selectByStatus(this.status);
  }

  drop(event: CdkDragDrop<Task[], Task[], Task>) {
    if (event.container === event.previousContainer) {
      return;
    }
    this.store.changeTaskStatus(event.item.data.id, this.status);
  }
}
