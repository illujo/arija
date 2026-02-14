import { Component, OnInit } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { ActivatedRoute, Route } from '@angular/router';
import { StationService } from 'src/app/services/station.service';
import { Station } from '../models/station';

@Component({
  selector: 'app-station-details',
  templateUrl: './station-details.component.html',
  styleUrls: ['./station-details.component.scss']
})
export class StationComponent implements OnInit {
  id: string = '';
  loadingStation: boolean = true;
  station: Station | undefined;
  backgroundColor: string = 'gray';

  constructor(
    private _route: ActivatedRoute,
    private _station: StationService,
    private _meta: Meta,
    private _title: Title
  ) {
    let id = this._route.snapshot.paramMap.get('id');
    if (id)
      this.id = id;

  }

  ngOnInit(): void {
    this.getData();
  }

  loadStation(station: Station) {

    console.log('loading', station);
    this.loadingStation = false;
    this.station = station;
    this.backgroundColor = station.level.color;
    this._meta.updateTag({
      property: 'og:title', content: `Kvalitet vazduha za ${this.station.info.location}, ${this.station.info.preciseLocation}`
    });
    this._title.setTitle(`Arija - ${this.station.info.location}, ${this.station.info.preciseLocation}`);
  }

  getData() {
    if (this.id) {
      this.loadingStation = true;

      // Change .then() to .subscribe()
      this._station.getStation(this.id).subscribe({
        next: (result) => {
          this.loadStation(result);
          this.loadingStation = false; // Good practice to turn off loader here
        },
        error: (err) => {
          console.error('Error loading station details:', err);
          this.loadingStation = false;
        }
      });
    }
  }
}
