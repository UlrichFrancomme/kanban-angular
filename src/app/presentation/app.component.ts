import { ChangeDetectionStrategy, Component } from '@angular/core';

import { BoardComponent } from './board/board.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: true,
  imports: [BoardComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {}
