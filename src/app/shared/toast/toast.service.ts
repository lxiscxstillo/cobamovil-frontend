import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export type ToastType = 'success' | 'error' | 'info' | 'warn';
export interface ToastItem { id: number; type: ToastType; message: string; }

@Injectable({ providedIn: 'root' })
export class ToastService {
  private seq = 0;
  private stream = new Subject<ToastItem>();
  public readonly toasts$ = this.stream.asObservable();

  private push(type: ToastType, message: string) {
    this.stream.next({ id: ++this.seq, type, message });
  }

  success(msg: string) { this.push('success', msg); }
  error(msg: string) { this.push('error', msg); }
  info(msg: string) { this.push('info', msg); }
  warn(msg: string) { this.push('warn', msg); }
}

