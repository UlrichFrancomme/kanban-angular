import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, HostBinding, computed, input } from '@angular/core';
import { Author } from '../task';

@Component({
  selector: 'app-author',
  standalone: true,
  imports: [
    CommonModule,
  ],
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


/*
0 : 0
1 : 1
2 : 10
3 : 11
4 : 100
5 : 101
6 : 110
7 : 111
8 : 1000
9 : 1001
10 : 1010
11 : 1011
12 : 1100
13 : 1101
14 : 1110
15 : 1111 

100000

Ulrich

U: 1010101 -> 101010100000
l: 1101100
r: 1110010
i: 1101001
c: 1100011
h: 1101000

  01010101
& 11111111
= 01010101

1010101 >> 0 & 11111111 = 1010101 (85)
colour += (85).toString(16).padStart(2, '0') = #55
1010101 >> 8 & 11111111 = 0 (0)
colour += (0).toString(16).padStart(2, '0') = #5500
1010101 >> 16 & 11111111 = 0 (0)
colour += (0).toString(16).padStart(2, '0') = #550000

*/