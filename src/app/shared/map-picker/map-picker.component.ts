import { Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';

declare const L: any;

@Component({
  selector: 'app-map-picker',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './map-picker.component.html',
  styleUrls: ['./map-picker.component.scss']
})
export class MapPickerComponent implements OnInit, OnDestroy {
  @ViewChild('mapEl', { static: true }) mapEl!: ElementRef<HTMLDivElement>;
  @Input() lat?: number;
  @Input() lng?: number;
  @Output() positionChange = new EventEmitter<{ lat: number; lng: number }>();

  private map?: any;
  private marker?: any;

  ngOnInit(): void {
    if (typeof L === 'undefined') return;
    const center = [this.lat ?? 4.7110, this.lng ?? -74.0721]; // Bogotá fallback
    this.map = L.map(this.mapEl.nativeElement).setView(center, 12);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap'
    }).addTo(this.map);

    if (this.lat != null && this.lng != null) {
      this.marker = L.marker(center).addTo(this.map);
    }

    this.map.on('click', (e: any) => {
      const { lat, lng } = e.latlng;
      if (this.marker) {
        this.marker.setLatLng([lat, lng]);
      } else {
        this.marker = L.marker([lat, lng]).addTo(this.map);
      }
      this.positionChange.emit({ lat, lng });
    });
  }

  ngOnDestroy(): void {
    if (this.map) {
      this.map.remove();
    }
  }
}

