export class LiveData {
    gpsId:number;
    objName: string;
    objType: number;
    gpsNumber: String;
    speed: number;
    point: number[];
    batteryPer: number;
    connToGPS: boolean;
    latLonIsZero: boolean;
    time: string;
    ordering:number;
    sleep:boolean;
    accuracy:number;

    constructor() {
        this.gpsId=0;
        this.objName = '';
        this.objType = 0;
        this.gpsNumber = '';
        this.speed = 0;
        this.point = [];
        this.batteryPer = 0;
        this.connToGPS = false;
        this.latLonIsZero = false;
        this.time = '';
        this.ordering=0;
        this.sleep=false;
        this.accuracy=0;
    }
}