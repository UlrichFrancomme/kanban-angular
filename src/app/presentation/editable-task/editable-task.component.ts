import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, EventEmitter, Output, ViewChild, signal } from '@angular/core';
import { PriorityComponent } from '../task/priority/priority.component';
import { IconComponent } from '../icon/icon.component';
import { Priority, Task } from 'src/app/core/task';


@Component({
  selector: '[app-editable-task]',
  standalone: true,
  imports: [
    CommonModule,
    PriorityComponent,
    IconComponent,
  ],
  templateUrl: './editable-task.component.html',
  styleUrls: ['./editable-task.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditableTaskComponent implements AfterViewInit {
  @Output() canceled = new EventEmitter<void>();
  @Output() created = new EventEmitter<Pick<Task, 'title' | 'priority'>>();

  @ViewChild('titleInput') titleInput!: ElementRef<HTMLElement>;

  priority = signal<Priority>('low');
  title = signal<string>('');

  ngAfterViewInit(): void {
    this.titleInput?.nativeElement.focus();
  }

  confirm(): void {
    if (this.title().length) {
      this.created.emit({ priority: this.priority(), title: this.title() });
    }
  }

  onKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      this.confirm();
      event.preventDefault();
    } else if (event.key === 'Escape') {
      this.canceled.emit();
      event.preventDefault();
    }
  }
}
