// import { MapsAPILoader, MapTypeStyle } from '@agm/core';
import { Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { GoogleMap, MapInfoWindow, MapMarker } from '@angular/google-maps';
import { Subject } from 'rxjs';
import { LiveData } from 'src/app/core/models/LiveData';
import { DataService } from 'src/app/core/services/db/data-service.service';
import { TrajectoryServiceDB } from 'src/app/core/services/db/trajectory_service_db.service';
import { ZoneServiceDB } from 'src/app/core/services/db/zone_service_db.service';
import { DatasourceCoordinates } from 'src/app/core/services/subject/datasource_coordinates.service';
import { FindDataService } from 'src/app/core/services/subject/find.service';
import { InfoContainerDataService } from 'src/app/core/services/subject/info_container_data.service';
import { LayoutService } from 'src/app/core/services/subject/layout.service';
import { LiveRefrseshService } from 'src/app/core/services/subject/live_refresh_service.service';
import { MapPath } from 'src/app/core/services/subject/map_path.service';
import { PathService } from 'src/app/core/services/subject/path.service';
import { ShowAllZones } from 'src/app/core/services/subject/show_all_zones.service';
import { VehicleService } from 'src/app/core/services/subject/vehicle_filter.service';
@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
  encapsulation: ViewEncapsulation.None,



})
export class MapComponent implements OnInit, OnDestroy {


  markerClustererImagePath =
    'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m';
  mapClickListener: any;
  // map: google.maps.Map<Element> | undefined;
  updateStrokeColor: string = "#07b57a";
  zone_allow = true;
  marker_display = false;
  lat: number = 40.414548;
  lng: number = 49.858065;
  zoom: number = 15;
  zone_path: Array<{ id: number, lat: number, lng: number }> = [];
  allZones: Array<any> = [{ allow: true, pointList: [] }];
  pointList: Array<{ id: number, lat: number, lng: number }> = [];
  mapDestroyer = new Subject();
  simulateTracks: any;
  originalTracks: any;
  clickFlag: boolean = false;
  doubleClickMap: boolean = false;
  //@ts-ignore
  map: GoogleMap;
  polylineOptions: google.maps.PolylineOptions = {
    geodesic: false,
    path: [],
    strokeColor: '#07b57a',
    icons: [
      {
        icon: {
          path: google.maps.SymbolPath.BACKWARD_CLOSED_ARROW,
          strokeColor: 'white',
          fillColor: '#EE4E4E',
          fillOpacity: 1,
          strokeWeight: 1,
          scale: 4
        },
        repeat: '200px',
        offset: '100%', // Adjust this value as needed
      },
    ],
  };
  // map_style: MapTypeStyle[] =
  //   [
  //     {
  //       "featureType": "all",
  //       "elementType": "labels.text",
  //       "stylers": [
  //         {
  //           "color": "#878787"
  //         }
  //       ]
  //     },
  //     {
  //       "featureType": "all",
  //       "elementType": "labels.text.stroke",
  //       "stylers": [
  //         {
  //           "visibility": "off"
  //         }
  //       ]
  //     },
  //     {
  //       "featureType": "landscape",
  //       "elementType": "all",
  //       "stylers": [
  //         {
  //           "color": "#f9f5ed"
  //         }
  //       ]
  //     },
  //     {
  //       "featureType": "road.highway",
  //       "elementType": "all",
  //       "stylers": [
  //         {
  //           "color": "#f5f5f5"
  //         }
  //       ]
  //     },
  //     {
  //       "featureType": "road.highway",
  //       "elementType": "geometry.stroke",
  //       "stylers": [
  //         {
  //           "color": "#c9c9c9"
  //         }
  //       ]
  //     },
  //     {
  //       "featureType": "water",
  //       "elementType": "all",
  //       "stylers": [
  //         {
  //           "color": "#aee0f4"
  //         }
  //       ]
  //     },
  //     {
  //       featureType: "poi",
  //       stylers: [
  //         { "visibility": "off" },
  //       ],
  //     },

  //     {
  //       featureType: "transit",
  //       stylers: [
  //         { "visibility": "off" },
  //       ],
  //     }

  //   ]

  constructor(
    private vehicle_service: VehicleService,
    private datasource_coordinates_service: DatasourceCoordinates,
    private map_path_service: MapPath,
    private show_all_zones_service: ShowAllZones,
    private find_service: FindDataService,
    public data_service: DataService,
    private live_refresh_service: LiveRefrseshService,
    private zone_service_db: ZoneServiceDB,
    private trajectory_service_db: TrajectoryServiceDB,
    private layout_service: LayoutService,
    private info_container_data_service: InfoContainerDataService,
    private path_service: PathService
  ) { }

  public ngOnInit(): void {


    this.path_service.path_data.subscribe((path: google.maps.LatLngLiteral[]) => {
      this.polylineOptions = {
        path: path,
      };
    })

    // this.trajectory_service_db.simulateTrajectory().subscribe((res) => {
    //   this.simulateTracks = res;
    // })

    // this.trajectory_service_db.originalTrajectory().subscribe((res) => {
    //   this.originalTracks = res;
    //   console.log(res)
    // })



    this.find_service.search_data.subscribe((data) => {
      this.lat = data.lat;
      this.lng = data.lng;
      this.zoom = data.zoom;
      this.marker_display = data.display;
      const position = new google.maps.LatLng(data.lat, data.lng);
      this.map.panTo(position);
    });

    this.vehicle_service.marker_focus.subscribe((res) => {
      this.data_service.live_trajectory_points = [];
      console.log(res)
      if (this.data_service.focus_gps_id != res.gpsId) {
        this.data_service.focus_gps_id = res.gpsId;
        this.vehicle_service.vehicle_set_center.next(res.gpsId);
      }
      else {
        this.data_service.focus_gps_id = 0
      }
    })

    this.vehicle_service.vehicle_set_center.subscribe((res) => {
      const index = this.data_service.all_live_cars.findIndex((d: any) => (d.gpsId == res));
      if (this.data_service.all_live_cars[index].point[0] != 0 && this.data_service.all_live_cars[index].point[1] != 0) {
        const point = new google.maps.LatLng(this.data_service.all_live_cars[index].point[0], this.data_service.all_live_cars[index].point[1]);
        this.map.panTo(point);
      }
    });

    this.vehicle_service.vehicle_set_center_by_latlon.subscribe((res: number[]) => {
      const point = new google.maps.LatLng(res[0], res[1]);
      this.map.panTo(point);
    })

    // marker path
    this.map_path_service.mapPath.subscribe((res) => {
      this.zone_path = [];
      for (var i = 0; i < res.coordinates.length; i++) {
        this.zone_path.push({ id: i + 1, lat: res.coordinates[i].latitude, lng: res.coordinates[i].longitude });
      }
      // this.zone_path_display = res.polygon_display;
      this.zone_allow = res.allow;

      if (res.coordinates.length != 0) {
        var bounds = new google.maps.LatLngBounds();

        for (var i = 0; i < this.zone_path.length; i++) {
          bounds.extend(new google.maps.LatLng(this.zone_path[i].lat, this.zone_path[i].lng));
        }
        this.map.fitBounds(bounds);
      }
      if (this.zone_allow == true) {
        this.updateStrokeColor = '#07b57a';
      }
      else if (this.zone_allow == false) {
        this.updateStrokeColor = '#EB2E2E';
      }
      else {
        this.updateStrokeColor = 'gray';
      }

    });

    this.show_all_zones_service.showAllPolygon.subscribe((res) => {
      this.zone_service_db.showAllZones(res.gpsId).subscribe((response) => {
        console.log(response, this.data_service.head_eye_icon_id)
        this.allZones = [];

        var bounds = new google.maps.LatLngBounds();

        if (this.data_service.head_eye_icon_id != res.gpsId) {
          this.data_service.head_eye_icon_id = res.gpsId;
          for (var zone of response) {
            this.pointList = [];
            if (zone.pointList != null) {
              for (var point of zone.pointList) {
                this.pointList.push({ id: point.id, lat: Number(point.latitude), lng: Number(point.longitude) });
                bounds.extend(new google.maps.LatLng(Number(point.latitude), Number(point.longitude)));
              }
              if (res.marker_lat != null && res.marker_lng != null) {
                bounds.extend(new google.maps.LatLng(Number(res.marker_lat), Number(res.marker_lng)));
              }
              zone = { allow: zone.allow, pointList: this.pointList }
              this.allZones.push(zone);
              this.map?.fitBounds(bounds);
            }
          };
        }
        else {
          this.data_service.head_eye_icon_id = -1;
          this.allZones = [];
        }
      });
    });

    this.live_refresh_service.live_data_refresh.subscribe((res) => {
      this.data_service.getLiveCarData().subscribe((data) => {
        this.data_service.all_live_cars = data;
      });
    })
  }

  clickMarker(data: any) {
    this.clickFlag = true;

    setTimeout(() => {
      if (this.clickFlag) {

        if (this.data_service.focus_gps_id != data.gpsId) {
          this.data_service.focus_gps_id = data.gpsId;
          this.layout_service.info_container_display.next({ component: "info-con", visibility: true });
          this.info_container_data_service.getData.next(data.gpsId)
          this.vehicle_service.vehicle_set_center.next(data.gpsId);

        }
        else {
          this.data_service.focus_gps_id = 0;
          this.layout_service.info_container_display.next({ component: "info-con", visibility: false });
        }
      }
      this.clickFlag = false;
    }, 200);
  }

  clickMap(map: google.maps.MapMouseEvent): any {
    this.layout_service.info_container_display.next({ component: "info-con", visibility: false });
    console.log(map.latLng?.lat())
    this.marker_display = false;
    this.data_service.eye_icon_id = -1;
    if (this.data_service.update_icon_id != -1) {
      const pointCoordinates = { id: this.zone_path.length + 1, lat: Number(Number(map.latLng?.lat()).toFixed(5)), lng: Number(Number(map.latLng?.lng().toFixed(5))) };
      this.zone_path = [...this.zone_path];
      this.zone_path.push(pointCoordinates);
      this.datasource_coordinates_service.datasourceCoordinates.next(this.zone_path);
    }
    else {
      this.data_service.head_eye_icon_id = -1;
    }
  }

  dblClickMap() {

  }

  dblClickMarker(data: any) {
    if (this.clickFlag) {

      this.data_service.focus_gps_id == data.gpsId;


      setTimeout(() => {
        this.vehicle_service.vehicle_set_center.next(data.gpsId);
      }, 500);
    }
    this.clickFlag = false;
  }

  public mapReadyHandler(map: GoogleMap): void {
      this.map = map;
  }

  public ngOnDestroy(): void {
    if (this.mapClickListener) {
      this.mapClickListener.remove();
    }
    this.mapDestroyer.next('');
    this.mapDestroyer.complete();
  }

  dragUpdateMarker(point: google.maps.MapMouseEvent, id: number) {
    
    const index = this.zone_path.findIndex((d) => (d.id == id));
    this.zone_path[index].lat = Number(Number(point.latLng?.lat()).toFixed(4));
    this.zone_path[index].lng = Number(Number(point.latLng?.lng()).toFixed(4));
    this.zone_path = [...this.zone_path];
    this.datasource_coordinates_service.datasourceCoordinates.next(this.zone_path);
  }

  clickNavbarArrow() {
    this.data_service.router_size_boolean = !this.data_service.router_size_boolean;
    this.layout_service.router_size_change.next(this.data_service.router_size_boolean);
  }

  isCenter() {
    this.data_service.is_center_object = !this.data_service.is_center_object;
    if (this.data_service.is_center_object && this.data_service.focus_gps_id != 0) {
      this.vehicle_service.vehicle_set_center.next(this.data_service.focus_gps_id);
    }

  }
  showObjects() {
    this.data_service.show_all_object = !this.data_service.show_all_object;
  }
  showZones() {
    this.show_all_zones_service.showAllPolygon.next({ gpsId: this.data_service.focus_gps_id });
  }


  showLiveTrajectory() {
    this.data_service.show_live_trajectory = !this.data_service.show_live_trajectory;
    if (!this.data_service.show_live_trajectory) {
      this.data_service.live_trajectory_points = [];
    }


  }

  openInfoWindow(marker: MapMarker, data: LiveData, infoWindow: MapInfoWindow) {
    infoWindow.open(marker);

    this.clickFlag = true;

    setTimeout(() => {
      if (this.clickFlag) {

        if (this.data_service.focus_gps_id != data.gpsId) {
          this.data_service.focus_gps_id = data.gpsId;
          this.layout_service.info_container_display.next({ component: "info-con", visibility: true });
          this.info_container_data_service.getData.next(data.gpsId)
          this.vehicle_service.vehicle_set_center.next(data.gpsId);

        }
        else {
          this.data_service.focus_gps_id = 0;
          this.layout_service.info_container_display.next({ component: "info-con", visibility: false });
        }
      }
      this.clickFlag = false;
    }, 200);
  }

  polygonEdit(){
    console.log(this.zone_path)
  }
}
