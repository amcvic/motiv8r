import { Component, OnInit } from '@angular/core';

import { MatDialogRef, MatDialog } from '@angular/material/dialog';

import { MeetupService } from '../meetup.service';

import OlMap from 'ol/Map';
import OlXYZ from 'ol/source/XYZ';
import OlTileLayer from 'ol/layer/Tile';
import OlView from 'ol/View';
import OlFeature from 'ol/Feature';
import OlGeomPoint from 'ol/geom/Point';
import OlSourceVector from 'ol/source/Vector';
import OlLayerVector from 'ol/layer/Vector';
import OlStyle from 'ol/style/Style';
import OlIcon from 'ol/style/Icon';

import { fromLonLat } from 'ol/proj';
import { Meetup } from '../meetup';

@Component({
  selector: 'app-meetup-details',
  templateUrl: './meetup-details.component.html',
  styleUrls: ['./meetup-details.component.css']
})
export class MeetupDetailsComponent implements OnInit {

  map: OlMap;
  source: OlXYZ;
  layer: OlTileLayer;
  view: OlView;
  latitude: number;
  longitude: number;

  marker: OlFeature;
  vectorSource: OlSourceVector;
  markerLayer: OlLayerVector;


  constructor(public dialogRef: MatDialogRef<MeetupDetailsComponent>, public meetupService: MeetupService) { }

  ngOnInit() {
    this.latitude = this.meetupService.currentMeetup.locationY;
    this.longitude = this.meetupService.currentMeetup.locationX;
    this.source = new OlXYZ({
      url: 'http://tile.osm.org/{z}/{x}/{y}.png'
    });
  
    this.layer = new OlTileLayer({
      source: this.source
    });
  
    this.view = new OlView({
      center: fromLonLat([this.longitude, this.latitude]),
      zoom: 15
    });

    this.marker = new OlFeature({
      geometry: new OlGeomPoint(
        fromLonLat([this.longitude, this.latitude])
      )
    });

    this.marker.setStyle(new OlStyle({
      image: new OlIcon(({
        anchor: [0.5,1],
        crossOrigin: 'anonymous',
        scale: 0.07,
        src: '../../assets/map-marker.png'
      }))
    }));

    this.vectorSource = new OlSourceVector({
      features: [this.marker]
    });

    this.markerLayer = new OlLayerVector({
      source: this.vectorSource
    });
  
    this.map = new OlMap({
      target: 'map2',
      layers: [this.layer, this.markerLayer],
      view: this.view
    });

  }

  // addToMeetup(): void {
  //   this.meetupService.addToMeetup(+localStorage.getItem('userid'))
  // }

  close() {
    this.dialogRef.close('successfully closed');
  }

}
