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
      const raw = anyErr?.error?.message || anyErr?.message || fallback;
      msg = this.normalizeErrorMessage(String(raw || fallback), fallback);
    } catch {
      msg = fallback;
    }
    // Mensaje más claro y no técnico para el usuario
    this.error(msg);
  }

  /**
   * Info helper: muestra información derivada de una fuente mixta
   * (útil para respuestas no críticas o avisos del backend).
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
  created(entity: string) { this.success(`${entity} creada correctamente.`); }
  updated(entity: string) { this.success(`${entity} actualizada correctamente.`); }
  deleted(entity: string) { this.success(`${entity} eliminada correctamente.`); }
  saved(entity: string) { this.success(`${entity} guardada correctamente.`); }
  started(entity: string) { this.success(`${entity} iniciada.`); }
  canceled(entity: string) { this.success(`${entity} cancelada.`); }
  reprogrammed(entity: string) { this.success(`${entity} reprogramada y pendiente de aprobación.`); }
  action(type: ToastType, msg: string, label: string, cb: () => void) { this.push(type, msg, label, cb); }

  private normalizeErrorMessage(raw: string, fallback: string): string {
    const text = (raw || '').toLowerCase();

    // Errores típicos de red / servidor
    if (text.includes('network') || text.includes('failed to fetch')) {
      return 'No pudimos conectar con el servidor. Verifica tu conexión a internet e inténtalo de nuevo.';
    }
    if (text.includes('internal server error') || text.includes('error interno')) {
      return 'Ha ocurrido un error inesperado en el sistema. Inténtalo de nuevo en unos minutos.';
    }

    // Validaciones genéricas de backend (Bean Validation)
    if (text.includes('must not be null') || text.includes('notnull')) {
      return 'Hay datos obligatorios sin completar. Revisa los campos marcados e inténtalo de nuevo.';
    }
    if (text.includes('must be a future date') || text.includes('future')) {
      return 'La fecha que elegiste debe ser posterior al momento actual. Elige una fecha y hora futuras.';
    }

    // Mensaje ya amigable del backend o fallback
    if (!raw || raw.trim().length === 0) {
      return fallback;
    }
    return raw;
  }
}

