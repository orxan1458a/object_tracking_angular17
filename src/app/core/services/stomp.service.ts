import { Injectable } from '@angular/core';
import * as SockJS from 'sockjs-client';
import * as Stomp from 'stompjs';
import { NotificationService } from './subject/notification.service';
import { DataService } from './db/data-service.service';
import { environment } from 'src/environments/environment';
import { NotificationData } from '../models/NotificationData';
import { LiveData } from '../models/LiveData';
import { VehicleService } from './subject/vehicle_filter.service';

@Injectable({
    providedIn: 'root',
})
export class StompService {
    private connecting: boolean = false;
    private topicQueue: any[] = [];

    socket = new SockJS(environment.rest_api + '/sba-websocket');
    stompClient: Stomp.Client = Stomp.over(this.socket);

    constructor(
        private notification_service: NotificationService,
        private data_service: DataService,
        private vehicle_service: VehicleService
    ) {
        this.setupWebSocketConnection();

        this.setupWebSocketConnection();

        this.subscribe("/topic/notification/" + localStorage.getItem('id'), "sdsa");
        this.subscribe("/topic/gpsLiveData/" + localStorage.getItem('id'), "sdsa");

        setInterval(() => {
            if (!this.stompClient.connected) {
                window.location.reload();
            }
        }, 5000);
    }
    private setupWebSocketConnection(): void {
        this.stompClient.connect({}, () => {
            this.connecting = false;
            this.handleConnected();
        }, (error) => {
            console.error('WebSocket Connection Error: ', error);
            this.reconnect(); // Bağlantı hatası durumunda yeniden bağlanmaya çalış
        });
    }

    private reconnect(): void {
        if (!this.connecting) {
            this.connecting = true;
            this.socket = new SockJS(environment.rest_api + '/sba-websocket');
            this.stompClient = Stomp.over(this.socket);
            this.setupWebSocketConnection();
        }
    }

    private handleConnected(): void {
        // Bağlandığınızda yapılması gereken işlemleri buraya ekleyebilirsiniz.
        console.log('WebSocket Connected!');
        // Ayrıca burada eğer bekleyen topicQueue varsa, onları da abone edebilirsiniz.
        this.topicQueue.forEach((item: any) => {
            this.subscribeToTopic(item.topic, item.callback);
        });
        this.topicQueue = []; // Queue'yu temizle
    }

    subscribe(topic: string, callback: any): void {
        // If stomp client is currently connecting add the topic to the queue
        if (this.connecting) {
            this.topicQueue.push({
                topic,
                callback
            });
            return;
        }

        const connected: boolean = this.stompClient.connected;
        if (connected) {
            // Once we are connected set connecting flag to false
            this.connecting = false;
            this.subscribeToTopic(topic, callback);
            return;
        }

        // If stomp client is not connected connect and subscribe to topic
        this.connecting = true;
        this.stompClient.connect({}, (): any => {
            this.subscribeToTopic(topic, callback);

            // Once we are connected loop the queue and subscribe to remaining topics from it
            this.topicQueue.forEach((item: any) => {
                this.subscribeToTopic(item.topic, item.callback);
            })

            // Once done empty the queue
            this.topicQueue = [];
        });
    }

    private subscribeToTopic(topic: string, callback: any): void {

        this.stompClient.subscribe(topic, (response?: any): any => {

            // notification topic,receiver notification
            if (topic.includes('/topic/notification/')) {

                var notificationData: NotificationData = JSON.parse(response.body);

                if (notificationData.text.contentId == 'gps_disconnected') {
                    const index = this.data_service.all_live_cars.findIndex((d: any) => (d.gpsId == notificationData.gpsId));

                    if (index != -1) {
                        this.data_service.all_live_cars[index].connToGPS = false;
                    }
                }

                if (notificationData.notification) {
                    this.notification_service.newNotification.next(notificationData);
                    this.sendNotificationToServer(notificationData.id);
                }
                else {
                    this.data_service.allNotificationsSize += 1;
                }
                // callback(response);
            }
            if (topic.includes('/topic/gpsLiveData/')) {
                var responseObject: LiveData = JSON.parse(response.body);
                const index = this.data_service.all_live_cars.findIndex((d: any) => (d.gpsId == responseObject.gpsId));
                if (index != -1) {
                    this.data_service.all_live_cars[index].time = responseObject.time;
                    if (responseObject.point[0] != 0) {
                        if (this.data_service.focus_gps_id != responseObject.gpsId) {
                            this.data_service.all_live_cars[index].point[0] = responseObject.point[0];
                            this.data_service.all_live_cars[index].point[1] = responseObject.point[1];
                        } else {
                            this.transition(index, responseObject.point[0], responseObject.point[1], this.data_service.all_live_cars[index].point[0], this.data_service.all_live_cars[index].point[1]);
                        }
                    }
                    this.data_service.all_live_cars[index].gpsId = responseObject.gpsId;
                    this.data_service.all_live_cars[index].objType = responseObject.objType;
                    this.data_service.all_live_cars[index].objName = responseObject.objName;
                    this.data_service.all_live_cars[index].gpsNumber = responseObject.gpsNumber;
                    this.data_service.all_live_cars[index].speed = responseObject.speed;
                    this.data_service.all_live_cars[index].batteryPer = responseObject.batteryPer;
                    this.data_service.all_live_cars[index].latLonIsZero = responseObject.point[0] == 0 ? true : false;
                    this.data_service.all_live_cars[index].ordering = responseObject.ordering;
                    this.data_service.all_live_cars[index].sleep = responseObject.sleep;
                    this.data_service.all_live_cars[index].accuracy = responseObject.accuracy;
                    if (this.data_service.is_center_object &&
                        this.data_service.focus_gps_id == this.data_service.all_live_cars[index].gpsId
                        && this.data_service.carTrackData.length == 0) {
                        this.vehicle_service.vehicle_set_center.next(this.data_service.focus_gps_id);
                    }



                    if (!this.data_service.all_live_cars[index].connToGPS) {
                        this.data_service.all_live_cars[index].connToGPS = responseObject.connToGPS;
                        this.data_service.all_live_cars = this.data_service.all_live_cars.sort((a: LiveData, b: LiveData) => b.ordering - a.ordering);

                    }
                    else {
                        this.data_service.all_live_cars[index].connToGPS = responseObject.connToGPS;
                    }



                    // real time object trajectory 
                    if (this.data_service.show_live_trajectory &&
                        this.data_service.focus_gps_id == this.data_service.all_live_cars[index].gpsId
                    ) {
                        var lastPoint = responseObject.point
                        if (lastPoint[0] != 0 && lastPoint[1] != 0) {
                            this.data_service.live_trajectory_points.push(lastPoint);
                        }
                    }

                    // -------------------
                }
                // if new device connect ,this part is working
                else {
                    if (responseObject.point[0] != 0) {

                        this.data_service.all_live_cars.push({
                            gpsId: responseObject.gpsId,
                            objName: responseObject.objName,
                            objType: responseObject.objType,
                            gpsNumber: responseObject.gpsNumber,
                            speed: responseObject.speed,
                            point: responseObject.point,
                            batteryPer: responseObject.batteryPer,
                            connToGPS: responseObject.connToGPS,
                            time: responseObject.time,
                            latLonIsZero: responseObject.point[0] == 0 ? true : false,
                            ordering: responseObject.ordering,
                            sleep: responseObject.sleep,
                            accuracy: responseObject.accuracy
                        });
                    }
                }
            }
        });
    }

    private sendNotificationToServer(notification_id: string): void {
        setTimeout(() => {
            this.stompClient.send('/ws/notificationSeen', {}, JSON.stringify(notification_id));
        }, 1000);
    }


    stringToDate(dateTimeString: String) {
        const [timeString, dateString] = dateTimeString.split(" ");

        const [hours, minutes, seconds] = timeString.split(":");
        const [day, month, year] = dateString.split("/");

        const date = new Date(Number(year), Number(month) - 1, Number(day), Number(hours), Number(minutes), Number(seconds));
        return date;
    }

    numDeltas = 20;
    delay = 50; //milliseconds


    transition(index: number, newLat: any, newLng: any, oldLat: any, oldLng: any) {

        var deltaLat;
        var deltaLng;
        var i = 0;
        deltaLat = (newLat - oldLat) / this.numDeltas;
        deltaLng = (newLng - oldLng) / this.numDeltas;
        this.moveMarker(index, newLat, newLng, oldLat, oldLng, deltaLat, deltaLng, i);
    }

    moveMarker(index: number, newLat: any, newLng: any, oldLat: any, oldLng: any, deltaLat: any, deltaLng: any, i: number) {
        
        oldLat += deltaLat;
        oldLng += deltaLng;
        this.data_service.all_live_cars[index].point[0] = oldLat;
        this.data_service.all_live_cars[index].point[1] = oldLng;
        if(this.data_service.is_center_object){
            this.vehicle_service.vehicle_set_center.next(this.data_service.focus_gps_id);
        }
        if (i != this.numDeltas) {
            i++;
            setTimeout(() => {
                this.moveMarker(index, newLat, newLng, oldLat, oldLng, deltaLat, deltaLng, i)
            }, this.delay);
        }
    }
}