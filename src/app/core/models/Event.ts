export class Event {
    dateTime:string;
    eventText:string;
    event_id:number;
    gpsSerialNumber:string;
    objectDetails:string;
    objectName:String;
    objectType:number;

    constructor() {
        this.dateTime = '';
        this.eventText = '';
        this.event_id = 0;
        this.gpsSerialNumber = '';
        this.objectDetails = '';
        this.objectName = '';
        this.objectType = 0;
     }
}