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
      this.vectorSource.addFeature((new OlFeature({
        geometry: new OlGeomPoint(
          fromLonLat([this.meetups[i].locationX, this.meetups[i].locationY]) //** */
        )
      })));
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
  
  
  
      // this.translate.on('translating', function (evt) {
      //   this.coordMarker = this.marker.getGeometry().getCoordinates();
      //   console.log(this.coordMarker);
      // });

    

  //   for (var i=0; i<10; i++) {
  //   this.vectorSource.addFeature(new OlFeature({
  //     geometry: new OlGeomPoint(
  //       fromLonLat([this.longitude, this.latitude]) //** */
  //     )
  //   }));
  // }

    // this.marker.setStyle(new OlStyle({
    //   image: new OlIcon(({
    //     anchor: [0.5,1],
    //     crossOrigin: 'anonymous',
    //     scale: 0.07,
    //     src: '../../assets/map-marker.png'
    //   }))
    // }));

  

  // submit(name: string, description: string, date: string, time: string, prereqs: string): void {
  //   console.log(transform((<OlGeomPoint>this.marker.getGeometry()).getCoordinates(), 'EPSG:3857', 'EPSG:4326'));
  //   if (!name || !description || !date || !time) {
  //     return;
  //   } else {
  //     let coords: number[] = transform((<OlGeomPoint>this.marker.getGeometry()).getCoordinates(), 'EPSG:3857', 'EPSG:4326');
  //     let arr: string[] = [];
  //     arr.push(prereqs);
  //     let timestamp: string = date + ' ' + time + ':00-04';
  //     this.meetupService.submitMeetup(name, description, timestamp, coords[0], coords[1], arr)
  //       .subscribe((response) => {
  //         console.log(response);
  //       });
  //     this.logService.createLog(name, timestamp)
  //       .subscribe((response) => {
  //         console.log(response);
  //       })
  //     this.close();
  //   }
  // }
