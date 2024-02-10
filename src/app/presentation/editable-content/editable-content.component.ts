import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';

@Component({
  selector: 'app-editable-content',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './editable-content.component.html',
  styleUrl: './editable-content.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditableContentComponent implements AfterViewInit {
  @Input() content = '';
  @Input() placeholder = '';
  @Output() contentChanged = new EventEmitter<string>();
  @Output() enterPressed = new EventEmitter<void>();
  @Output() escapePressed = new EventEmitter<void>();

  @ViewChild('titleInput') titleInput!: ElementRef<HTMLElement>;

  ngAfterViewInit(): void {
    this.titleInput?.nativeElement.focus();
  }

  onKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      this.enterPressed.emit();
      event.preventDefault();
    } else if (event.key === 'Escape') {
      this.escapePressed.emit();
      event.preventDefault();
    }
  }
}
