import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

import { MeetupService } from '../meetup.service';
import { LogService } from '../log.service';

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
import OlInteraction from 'ol/interaction/Interaction';
import OlInteractionTranslate from 'ol/interaction/Translate';
import OlCollection from 'ol/Collection';

import { defaults } from 'ol/interaction';
import { fromLonLat, transform } from 'ol/proj';

@Component({
  selector: 'app-new-meetup',
  templateUrl: './new-meetup.component.html',
  styleUrls: ['./new-meetup.component.css']
})
export class NewMeetupComponent implements OnInit {

  map: OlMap;
  source: OlXYZ;
  layer: OlTileLayer;
  view: OlView;
  latitude: number;
  longitude: number;

  marker: OlFeature;
  vectorSource: OlSourceVector;
  markerLayer: OlLayerVector;
  translate: OlInteractionTranslate;
  defaults: OlInteraction;

  constructor(public dialogRef: MatDialogRef<NewMeetupComponent>, private meetupService: MeetupService, private logService: LogService) { }

  ngOnInit() {
    navigator.geolocation.getCurrentPosition((position) => {
      console.log("Latitude:", position.coords.latitude, "\nLongitude:", position.coords.longitude);
      this.latitude = position.coords.latitude;
      this.longitude = position.coords.longitude;
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

      this.translate = new OlInteractionTranslate({
        features: new OlCollection([this.marker])
      });

      // this.translate.on('translating', function (evt) {
      //   this.coordMarker = this.marker.getGeometry().getCoordinates();
      //   console.log(this.coordMarker);
      // });
  
      this.map = new OlMap({
        target: 'map',
        layers: [this.layer, this.markerLayer],
        interactions: defaults().extend([
          this.translate
        ]),
        view: this.view
      });

    });
    
  }

  close() {
    this.dialogRef.close('succesfully closed');
  }

  submit(name: string, description: string, date: string, time: string, prereqs: string): void {
    console.log(transform((<OlGeomPoint>this.marker.getGeometry()).getCoordinates(), 'EPSG:3857', 'EPSG:4326'));
    if (!name || !description || !date || !time) {
      return;
    } else {
      let coords: number[] = transform((<OlGeomPoint>this.marker.getGeometry()).getCoordinates(), 'EPSG:3857', 'EPSG:4326');
      let arr: string[] = [];
      arr.push(prereqs);
      let timestamp: string = date + ' ' + time + ':00-04';
      this.meetupService.submitMeetup(name, description, timestamp, coords[0], coords[1], arr)
        .subscribe((response) => {
          console.log(response);
        });
      this.logService.createLog(name, timestamp)
        .subscribe((response) => {
          console.log(response);
        })
      this.close();
    }
  }

}
