import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';

import { Priority, Task } from '@kb/core/task';

import { AuthorComponent } from './author/author.component';
import { IconComponent } from '../icon/icon.component';
import { MenuService } from '../menu/menu.service';
import { PriorityComponent } from '../priority/priority.component';

@Component({
  selector: '[app-task]',
  standalone: true,
  imports: [CommonModule, IconComponent, PriorityComponent, AuthorComponent],
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskComponent {
  @Input({ required: true }) task!: Task;
  @Output() deleted = new EventEmitter<string>();
  @Output() prorityChanged = new EventEmitter<Pick<Task, 'id' | 'priority'>>();

  @ViewChild('trigger', { read: ElementRef }) trigger?: ElementRef<HTMLElement>;

  constructor(private menuService: MenuService) {}

  triggerMenu(): void {
    const viewportOffset = this.trigger?.nativeElement?.getBoundingClientRect();
    this.menuService.openMenu(this.task, {
      top: viewportOffset?.top ?? 0,
      left: viewportOffset?.left ?? 0,
      right: viewportOffset?.right ?? 0,
    });
  }

  changePriority(priority: Priority): void {
    this.prorityChanged.emit({ id: this.task.id, priority });
  }
}
