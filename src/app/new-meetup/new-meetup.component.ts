import { Component, OnInit } from '@angular/core';

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
import OlInteractionTranslate from 'ol/interaction/Translate';
import OlCollection from 'ol/Collection';

import { fromLonLat } from 'ol/proj';

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

  coordMarker: number[];
  hit: boolean;

  constructor() { }

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
        // interactions: [this.translate],
        view: this.view
      });

    });
    
  }

}
