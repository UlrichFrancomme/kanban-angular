import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, computed, input, signal } from '@angular/core';
import { PriorityComponent } from './priority/priority.component';
import { Task } from '../core/task';
import { AuthorComponent } from './author/author.component';

@Component({
  selector: '[app-task]',
  standalone: true,
  imports: [
    CommonModule,
    PriorityComponent,
    AuthorComponent,
  ],
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskComponent {
  @Input({ required: true }) task!: Task;
}
