import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export type ToastType = 'success' | 'error' | 'info' | 'warn';
export interface ToastItem { id: number; type: ToastType; message: string; actionLabel?: string; action?: () => void }

@Injectable({ providedIn: 'root' })
export class ToastService {
  private seq = 0;
  private stream = new Subject<ToastItem>();
  public readonly toasts$ = this.stream.asObservable();

  private push(type: ToastType, message: string, actionLabel?: string, action?: () => void) {
    this.stream.next({ id: ++this.seq, type, message, actionLabel, action });
  }

  success(msg: string) { this.push('success', msg); }
  error(msg: string) { this.push('error', msg); }
  info(msg: string) { this.push('info', msg); }
  warn(msg: string) { this.push('warn', msg); }

  /**
   * Standardized error helper: extracts a readable message from common HTTP error shapes.
   * Falls back to the provided Spanish message to keep UX consistent.
   */
  errorFrom(err: unknown, fallback: string) {
    let msg = fallback;
    try {
      const anyErr = err as any;
      msg = anyErr?.error?.message || anyErr?.message || fallback;
    } catch {}
    this.error(String(msg || fallback));
  }

  /**
   * Info helper: muestra informaciÃ³n derivada de una fuente mixta
   * (Ãºtil para respuestas no crÃ­ticas o avisos del backend).
   */
  infoFrom(src: unknown, fallback: string) {
    let msg = fallback;
    try { msg = (src as any)?.message || fallback; } catch {}
    this.info(String(msg || fallback));
  }

  /**
   * Warn helper: estandariza avisos no bloqueantes (validaciones suaves).
   */
  warnFrom(src: unknown, fallback: string) {
    let msg = fallback;
    try {
      const anySrc = src as any;
      msg = anySrc?.error?.message || anySrc?.message || fallback;
    } catch {}
    this.warn(String(msg || fallback));
  }

  // Success helpers (estandarizados)
  ok(message = 'Acción completada') { this.success(message); }
  created(entity: string) { this.success(`${entity} creada`); }
  updated(entity: string) { this.success(`${entity} actualizada`); }
  deleted(entity: string) { this.success(`${entity} eliminada`); }
  saved(entity: string) { this.success(`${entity} guardada`); }
  started(entity: string) { this.success(`${entity} iniciada`); }
  canceled(entity: string) { this.success(`${entity} cancelada`); }
  reprogrammed(entity: string) { this.success(`${entity} reprogramada y pendiente de aprobación`); }
  action(type: ToastType, msg: string, label: string, cb: () => void) { this.push(type, msg, label, cb); }

}

