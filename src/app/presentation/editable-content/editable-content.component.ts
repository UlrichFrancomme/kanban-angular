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

import { IconComponent } from '../icon/icon.component';

@Component({
  selector: 'app-editable-content',
  standalone: true,
  templateUrl: './editable-content.component.html',
  styleUrl: './editable-content.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, IconComponent],
})
export class EditableContentComponent implements AfterViewInit {
  @Input() content = '';
  @Input() placeholder = '';
  @Output() contentChanged = new EventEmitter<string>();

  @ViewChild('input') input!: ElementRef<HTMLElement>;

  ngAfterViewInit(): void {
    this.input?.nativeElement.focus();
  }
}
