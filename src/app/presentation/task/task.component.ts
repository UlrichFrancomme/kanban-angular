import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Task } from 'src/app/core/task';

import { AuthorComponent } from './author/author.component';
import { PriorityComponent } from './priority/priority.component';

@Component({
  selector: '[app-task]',
  standalone: true,
  imports: [CommonModule, PriorityComponent, AuthorComponent],
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskComponent {
  @Input({ required: true }) task!: Task;
}
