import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Station } from '../stations/models/station';

@Injectable({
  providedIn: 'root'
})
export class StationService {
  private apiUrl = 'http://192.168.100.9:3000'; // Match your NestJS port

  levels = [
    { desc: 'odličan', color: "#40b0b8", min: 0, max: 25 },
    { desc: 'dobar', color: "#79b54a", min: 26, max: 50 },
    { desc: 'prihvatljiv', color: "#bab538", min: 51, max: 100 },
    { desc: 'loš', color: "#c46b2b", min: 101, max: 200 },
    { desc: 'jako loš', color: "#cf2929", min: 201, max: 300 },
    { desc: 'užasno loš', color: "#911d5c", min: 301, max: 400 },
    { desc: 'opasan', color: "#5c1146", min: 401, max: 500 }
  ];

  constructor(private http: HttpClient) { }

  /**
   * GET ALL STATIONS
   * Maps the DB response into your Station UI model
   */
  getStations(): Observable<Station[]> {
    return this.http.get<any[]>(`${this.apiUrl}/station`).pipe(
      map(data => data.map(s => this.transformToUiModel(s)))
    );
  }

  /**
   * GET ONE STATION
   */
  getStation(id: string): Observable<Station> {
    return this.http.get<any>(`${this.apiUrl}/station/${id}`).pipe(
      map(s => this.transformToUiModel(s))
    );
  }

  /**
   * TRANSFORMER: API -> UI Model
   * This bridges the gap between your NestJS response and your existing frontend interfaces
   */
  private transformToUiModel(apiData: any): Station {
    const station: any = {
      info: {
        id: apiData.id,
        location: apiData.area,
        preciseLocation: apiData.site,
        coordinates: [
          parseFloat(apiData.latitude),
          parseFloat(apiData.longitude)
        ]
      },
      meteo: {
        temperature: apiData.last_temperature || 0,
        humidity: apiData.last_humidity || 0,
        report: this.getMeteoReport(apiData.id) // Helper for labels
      },
      airQuality: {
        aqi: apiData.last_aqi || 0,
        pm2point5: apiData.pm25 || 0,
        pm10: apiData.pm10 || 0,
        tvoc: 0 // Not in current API
      }
    };

    // Attach the color level based on AQI
    station.level = this.findLevel(station.airQuality.aqi);
    return station;
  }

  private findLevel(value: number) {
    return this.levels.find(range => value >= range.min && value <= range.max) || this.levels[0];
  }

  private getMeteoReport(temp: number): string {
    if (temp === null || temp === undefined) return 'Nema podataka';
    return temp > 20 ? 'Vedro' : 'Oblačno'; // Simple logic for placeholder
  }
}