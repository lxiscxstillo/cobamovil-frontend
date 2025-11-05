import { Component, ElementRef, Input, OnChanges, OnDestroy, SimpleChanges, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';

declare const L: any;

@Component({
  selector: 'app-map-route',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './map-route.component.html',
  styleUrls: ['./map-route.component.scss']
})
export class MapRouteComponent implements OnChanges, OnDestroy {
  @ViewChild('mapEl', { static: true }) mapEl!: ElementRef<HTMLDivElement>;
  @Input() points: { lat: number; lng: number; label?: string }[] = [];

  private map?: any;
  private layerGroup?: any;

  ngOnChanges(changes: SimpleChanges): void {
    if (typeof L === 'undefined') return;
    if (!this.map) {
      this.map = L.map(this.mapEl.nativeElement).setView([4.7110, -74.0721], 11);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '&copy; OpenStreetMap' }).addTo(this.map);
      this.layerGroup = L.layerGroup().addTo(this.map);
    }
    this.render();
  }

  private render() {
    if (!this.layerGroup) return;
    this.layerGroup.clearLayers();
    const coords: any[] = [];
    for (const p of this.points) {
      if (p.lat == null || p.lng == null) continue;
      coords.push([p.lat, p.lng]);
      const m = L.marker([p.lat, p.lng]);
      if (p.label) m.bindPopup(p.label);
      m.addTo(this.layerGroup);
    }
    if (coords.length >= 2) {
      const poly = L.polyline(coords, { color: '#f4c653' });
      poly.addTo(this.layerGroup);
      this.map.fitBounds(poly.getBounds(), { padding: [20,20] });
    } else if (coords.length === 1) {
      this.map.setView(coords[0], 13);
    }
  }

  ngOnDestroy(): void { if (this.map) this.map.remove(); }
}

