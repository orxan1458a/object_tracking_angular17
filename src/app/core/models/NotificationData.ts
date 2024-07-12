export class NotificationData {
    id: string;
    address: string;
    text: any;
    gpsSerialNumber: string;
    gpsId:number;
    objectType: String;
    objectName: '';
    objectDetails: string;
    userId: number;
    currentDateTime: Date;
    notification:boolean
   

    constructor() {
        this.id = '';
        this.address='';
        this.text='';
        this.gpsSerialNumber='';
        this.gpsId=0;
        this.objectType='';
        this.objectName='';
        this.objectDetails='';
        this.userId=0;
        this.currentDateTime=new Date();
        this.notification=false;

       
    }
}