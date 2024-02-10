import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  Input,
  OnInit,
} from '@angular/core';

import { TasksStore } from '@kb/core';

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
  @Input({ required: true }) taskId!: string;
  private initialized = false;

  constructor(
    private store: TasksStore,
    private elementRef: ElementRef<HTMLElement>,
    private menuService: MenuService,
  ) {}

  ngOnInit(): void {
    this.initialized = true;
  }

  deleteTask(): void {
    this.store.deleteTask(this.taskId);
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
