import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { StationService } from 'src/app/services/station.service';
import { Station } from '../models/station';


@Component({
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {

  stations: Station[] = [];
  sortDirection: string = 'desc';
  constructor(
    private _stationService: StationService,
    private _title: Title
  ) {
    this._title.setTitle('Arija - Niđe nebo nije plavo');
  }

  ngOnInit() {
    this._stationService.getStations().subscribe({
      next: (data) => this.stations = data,
      error: (err) => console.error('API Error:', err)
    });
    console.log('this.stations', this.stations);
  }

}
