export class EventInfo {
    eventId:number;
    gpsNumber: string;
    objName: string;
    objDetails: '';
    eventText: string;
    point: number[];
    heading: number;
    speed: number;
    time: string;
    address: string;
    imageUrl: string;
    satelliteCount:number;
    gsmSignalLvl:number;
    batteryLvl:number;

    constructor() {
        this.eventId = 0;
        this.gpsNumber = '';
        this.objName = '';
        this.gpsNumber = '';
        this.objDetails = '';
        this.eventText = '';
        this.point = [];
        this.heading = 0;
        this.speed = 0;
        this.time = '';
        this.address='';
        this.imageUrl='';
        this.satelliteCount=0;
        this.gsmSignalLvl=0;
        this.batteryLvl=0;
    }
}