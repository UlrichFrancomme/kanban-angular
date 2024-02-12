import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  Input,
  OnInit,
  Renderer2,
} from '@angular/core';

import { Status, Statuses, Task, TasksStore } from '@kb/core';

import { MenuService } from './menu.service';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MenuComponent implements OnInit {
  @Input({ required: true }) task!: Task;
  statuses = Statuses;

  private initialized = false;
  private boundingRect!: DOMRect;

  constructor(
    private store: TasksStore,
    private renderer: Renderer2,
    private elementRef: ElementRef<HTMLElement>,
    private menuService: MenuService,
  ) {}

  ngOnInit(): void {
    this.initialized = true;
    this.boundingRect = this.elementRef.nativeElement.getBoundingClientRect();
  }

  openSubmenu(element: HTMLElement): void {
    const menuDistanceFromRightEdge =
      document.documentElement.clientWidth - this.boundingRect.right;

    const position: 'left' | 'right' =
      menuDistanceFromRightEdge > this.boundingRect.width ? 'left' : 'right';
    this.renderer.setStyle(element, position, `${this.boundingRect.width}px`);
    this.renderer.setStyle(element, 'display', 'block');
  }

  hideSubmenu(element: HTMLElement): void {
    this.renderer.setStyle(element, 'display', 'none');
  }

  deleteTask(): void {
    this.store.deleteTask(this.task.id);
    this.menuService.closeMenu();
  }

  changeStatus(status: Status): void {
    this.store.changeTaskStatus(this.task.id, status);
    this.menuService.closeMenu();
  }

  @HostListener('window:click', ['$event'])
  private outsideClick(event: PointerEvent): void {
    // The event is triggered on the click to open the menu, closing it right away before it can be displayed.
    // The initialized property allows to prevent this as the init hook is called after the click event.
    if (
      this.initialized &&
      this.elementRef.nativeElement.contains(event.target as Node) === false
    ) {
      this.menuService.closeMenu();
    }
  }
}
