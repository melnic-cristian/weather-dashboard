import {Component, EventEmitter, input, Output} from '@angular/core';

@Component({
  standalone: true,
  selector: 'app-error-message',
  template: `
    <div class="error-message" role="alert">
      <div class="error-message__content">
        <h3 class="error-message__title">{{ title() }}</h3>
        <p class="error-message__text">{{ message() }}</p>
        @if (showRetry()) {
          <button class="error-message__button" (click)="retry.emit()" type="button">
            Try Again
          </button>
        }
      </div>
    </div>
  `,
  styleUrl: './error.component.scss'
})
export default class ErrorMessageComponent {
  title = input<string>('Error');
  message = input<string>('Something went wrong. Please try again.');
  showRetry = input<boolean>(true);
  @Output() retry = new EventEmitter<void>();
}
