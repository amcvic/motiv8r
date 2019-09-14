import { Component, OnInit, Renderer2 } from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';

import {MeetupService} from '../meetup.service';
import {Meetup} from '../meetup';
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
import { map } from 'rxjs/operators';

  @Component({
    selector: 'app-active-meetups',
    templateUrl: './active-meetups.component.html',
    styleUrls: ['./active-meetups.component.css']
  })
  
  export class ActiveMeetupsComponent implements OnInit {
  
  meetups: Meetup[];
  dataSource: Meetup[];
  displayedColumns: string[];
  locationX: number;
  locationY: number;
  
  map: OlMap;
  source: OlXYZ;
  layer: OlTileLayer;
  view: OlView;
  // latitude: number;
  // longitude: number;

  currentLocationMarker: OlFeature;
  vectorSource: OlSourceVector;
  markerLayer: OlLayerVector;
  translate: OlInteractionTranslate;
  defaults: OlInteraction;

  private activeMeets: boolean = false;
  private mapLoaded: boolean = false;

  constructor(private renderer: Renderer2, private meetupService: MeetupService) { }

dateTrim() {
  for (let i=0; i < this.meetups.length; i++) {
    this.meetups[i].date= this.meetups[i].date.substring(0,10); 
    console.log (this.meetups[i].date);
  }
}

  makeMarker() {
    for (let i=0; i < this.meetups.length; i++) {
      let feature: OlFeature = (new OlFeature({
        geometry: new OlGeomPoint(
          fromLonLat([this.meetups[i].locationX, this.meetups[i].locationY]) //** */
        )
      }));
      feature.set('id', this.meetups[i].id)
      this.vectorSource.addFeature(feature);
    }
    let features = this.vectorSource.getFeatures();
    console.log(features);
      features.forEach(el => {
        el.setStyle(new OlStyle({
          image: new OlIcon(({
            anchor: [0.5,1],
            crossOrigin: 'anonymous',
            scale: 0.07,
            src: '../../assets/map-marker.png'
          }))
        }))
      });
  }

  showActiveMeetups():void {
    this.meetupService.getMeetups(this.locationX, this.locationY)
      .subscribe((response) => { 
        this.meetups = (response);
        console.log(this.meetups);
        this.displayedColumns= ['name', 'date', 'description'];

        // this.dateTrim();
        this.makeMarker();
        this.dataSource = this.meetups;
        console.log(this.map);
      })}; 

      toggle(): void {
        this.activeMeets = !this.activeMeets;
        if (!this.activeMeets) {
          this.mapLoaded = false;
        }
      }

    ngOnInit() {
      this.loadMap();
    }

  loadMap(): void {
    navigator.geolocation.getCurrentPosition((position) => {
      this.locationY = position.coords.latitude;
      this.locationX = position.coords.longitude;
      this.source = new OlXYZ({
        url: 'http://tile.osm.org/{z}/{x}/{y}.png'
      })
  
      this.layer = new OlTileLayer({
        source: this.source
      });
  
      this.view = new OlView({
        center: fromLonLat([this.locationX, this.locationY]),
        zoom: 15
      });

      this.currentLocationMarker = new OlFeature({
        geometry: new OlGeomPoint(
          fromLonLat([this.locationX, this.locationY])
        )
      });

      this.currentLocationMarker.setStyle(new OlStyle({
        image: new OlIcon(({
          anchor: [0.5,1],
          crossOrigin: 'anonymous',
          scale: 0.07,
          src: '../../assets/map-marker.png'
        }))
      }));

      this.vectorSource = new OlSourceVector({
        features: [this.currentLocationMarker]
      });

      this.markerLayer = new OlLayerVector({
        source: this.vectorSource
      });

      this.map = new OlMap({
        target: 'map',
        layers: [this.layer, this.markerLayer],
        view: this.view
      });
      let tempMap = this.map;
      let tempMeetups = this.meetups;
      let currentMeetup: Meetup;
      this.map.on('singleclick', function(e) {
        tempMap.forEachFeatureAtPixel(e.pixel, function(feature) {
          console.log(feature.get('id'));
          tempMeetups.forEach(e => {
            if (e.id === feature.get('id')) {
              currentMeetup = e;
              console.log(e);
            }
          })
        })
      });
      this.meetupService.currentMeetup = currentMeetup;
      console.log('map should be loaded');
      this.showActiveMeetups();
      
    });

    if (!this.activeMeets) {
      this.mapLoaded = false;
    } else {
      this.mapLoaded = true;
    }

  }

}
