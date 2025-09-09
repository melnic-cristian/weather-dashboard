import {Component, input} from '@angular/core';

@Component({
  standalone: true,
  selector: 'app-loading-spinner',
  template: `
    <div class="loading" [attr.aria-label]="message()">
      <div class="loading__spinner"></div>
      <p class="loading__message">{{ message() }}</p>
    </div>
  `,
  styleUrls: ['./loading-spinner.component.scss']
})
export default class LoadingSpinnerComponent {
  message = input<string>('Loading');
}
