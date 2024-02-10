import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  signal,
  ViewChild,
} from '@angular/core';

import { Task } from '@kb/core/task';

import { AuthorComponent } from './author/author.component';
import { PriorityComponent } from './priority/priority.component';
import { IconComponent } from '../icon/icon.component';
import { MenuService } from '../menu/menu.service';

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

  @ViewChild('trigger', { read: ElementRef }) trigger?: ElementRef<HTMLElement>;
  @ViewChild('menu') menu?: ElementRef<HTMLElement>;

  menuDisplayed = signal(false);

  constructor(private menuService: MenuService) {}

  // @HostListener('window:click', ['$event'])
  // onBackdropClick(event: PointerEvent) {
  // if (this.menu?.nativeElement.contains(event.target as Node) === false) {
  // this.menuDisplayed.set(false);
  // }
  // }

  triggerMenu(): void {
    const viewportOffset = this.trigger?.nativeElement?.getBoundingClientRect();
    this.menuService.openMenu(this.task.id, {
      top: viewportOffset?.top ?? 0,
      left: viewportOffset?.left ?? 0,
    });
  }
}
