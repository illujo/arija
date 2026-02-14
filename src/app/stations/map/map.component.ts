import { Component, OnInit } from '@angular/core';
import { StationService } from 'src/app/services/station.service';
import { Station } from '../models/station';
import { Title } from '@angular/platform-browser';
// Keep the declare for OpenLayers
declare var ol: any;

@Component({
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {
  map: any;
  stations: Station[] = [];
  loaded: boolean = false;

  constructor(
    private _title: Title,
    private _station: StationService
  ) {
    this._title.setTitle('Arija - Niđe nebo nije plavo');
  }

  ngOnInit() {
    this.initMap();
    this.getStations();
  }

  initMap() {
    this.map = new ol.Map({
      target: 'map',
      layers: [
        new ol.layer.Tile({
          source: new ol.source.OSM()
        })
      ],
      view: new ol.View({
        center: ol.proj.fromLonLat([19.267509, 42.748515]),
        zoom: 9
      })
    });
  }

  getStations() {
    // 1. Changed .then() to .subscribe() for the new Observable service
    this._station.getStations().subscribe({
      next: async (stations) => {
        this.stations = stations;

        // 2. Wait for Angular's *ngFor to render the marker elements in map.component.html
        // We use a small timeout to ensure the DOM cycle is complete
        await new Promise(resolve => setTimeout(resolve, 100));

        this.setStationMarkers(stations);
        this.setCenter();
        this.unhideMarkers();
        this.loaded = true;
      },
      error: (err) => console.error('Error fetching stations for map:', err)
    });
  }

  setStationMarkers(stations: Station[]) {
    stations.forEach(station => {
      const element = document.getElementById('sm' + station.info.id);

      if (element) {
        const marker = new ol.Overlay({
          // Note: Coordinates are [Lon, Lat] in OpenLayers
          position: ol.proj.fromLonLat([station.info.coordinates[1], station.info.coordinates[0]]),
          positioning: 'center-center',
          element: element,
          stopEvent: false,
        });
        this.map.addOverlay(marker);
      } else {
        console.warn(`Could not find DOM element for station: sm${station.info.id}`);
      }
    });
  }

  setCenter() {
    const view = this.map.getView();
    view.setCenter(ol.proj.fromLonLat([19.267509, 42.748515]));
    view.setZoom(9);
  }

  unhideMarkers() {
    // Small delay to ensure the 'loaded' class triggers the CSS transition smoothly
    setTimeout(() => {
      this.stations.forEach(station => {
        document.getElementById('sm' + station.info.id)?.classList.add('loaded');
      });
    }, 50);
  }
}