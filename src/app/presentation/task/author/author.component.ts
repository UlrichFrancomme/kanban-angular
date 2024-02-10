import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, HostBinding, input } from '@angular/core';
import { Author } from 'src/app/core/task';

@Component({
  selector: 'app-author',
  standalone: true,
  imports: [CommonModule],
  template: `{{ initial() }}`,
  styleUrl: './author.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthorComponent {
  author = input.required<Author>();

  initial = computed(() => this.author().name[0].toUpperCase());
  color = computed(() => this.generateColorFrom(this.author().name));

  @HostBinding('style.background-color') get backgroundColor(): string {
    return this.color();
  }

  private generateColorFrom(name: string): string {
    const hash = name.split('').reduce((acc, char) => char.charCodeAt(0) + ((acc << 5) - acc), 0);
    let color = '#';
    for (let i = 0; i < 3; i++) {
      const value = (hash >> (i * 8)) & 0xff;
      color += value.toString(16).padStart(2, '0');
    }
    return color;
  }
}
