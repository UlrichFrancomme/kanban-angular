import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Priority } from 'src/app/core/task';

@Component({
  selector: 'app-priority',
  standalone: true,
  imports: [
    CommonModule,
  ],
  template: `<div [ngClass]="priority">{{ priority }}</div>`,
  styleUrl: './priority.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PriorityComponent {
  @Input({ required: true }) priority!: Priority;
}
