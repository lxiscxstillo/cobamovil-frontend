import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToastContainerComponent } from './shared/toast/toast-container.component';
import { BackToTopComponent } from './shared/back-to-top/back-to-top.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ToastContainerComponent, BackToTopComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('cobamovil-frontend');
}
