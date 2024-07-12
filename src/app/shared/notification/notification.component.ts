import { animate, group, state, style, transition, trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { timeout } from 'rxjs';
import { NotificationService } from 'src/app/core/services/subject/notification.service';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss'],
  animations: [
    trigger('openClose', [
      state('false', style({
        // transform: 'translateX(120%)',
        display: 'none',
      })),
      transition('true => false',
        [group([
          animate('400ms linear', style({
            // transform: 'translatex(120%)',
            opacity:0
          })),
        ])
        ]),
      transition('false => true', [group([
        animate('0ms linear', style({
          display: 'grid',
          opacity:0
          // transform: 'translateX(120%)'
        })),
        animate('1000ms linear', style({
          opacity:1
        }))
      ])
      ]),
    ]),
  ]
})
export class NotificationComponent implements OnInit {
  openedNotification: { isOpen: boolean, res: any }[] = [];

  language = localStorage.getItem('language')

  constructor(
    private notification_service: NotificationService
  ) { }

  ngOnInit(): void {

    var timeouts: any = [];
    this.notification_service.newNotification.subscribe((res) => {
      res.currentDateTime = this.secondCalculate(res.currentDateTime)
      console.warn(this.openedNotification.length + " bildirislerin sayi")
      
      this.openedNotification.push({
        isOpen: false,
        res: res
      });
      
      const openedIndex = this.openedNotification.findIndex(r => r.res == res);
      
      setTimeout(() => {
        this.playAudio();
        this.openedNotification[openedIndex].isOpen = true;
      }, 500);

      setTimeout(() => this.openedNotifClean(res),7000);

      console.log(timeouts.length + "bildirs timeout")
    });

    setInterval(() => {
      timeouts = [];
    }, 7000);
  }

  openedNotifClean(res: any) {
    console.log(res)
    const openedIndex = this.openedNotification.findIndex(r => r.res == res);
    this.openedNotification[openedIndex].isOpen = false;

    if(this.openedNotification.length>30){
      this.openedNotification.splice(0,15);
    }


  }
  playAudio() {
    let audio = new Audio();
    audio.src = "../../../assets/audios/notification.mp3";
    audio.load();
    audio.autoplay
    audio.play();
  }

  secondCalculate(stringDate: string) {
    const now = new Date();

    var [time, date] = stringDate.split(' ');
    const [hours, minutes, seconds] = time.split(':');
    const [day, month, year] = date.split('/');
    const dateTime = new Date(+year, +month - 1, +day, +hours, +minutes, +seconds);
    const timeDiffer = (now.getTime() - dateTime.getTime()) / 1000;
    return timeDiffer > 20 ? stringDate : 'İndicə';
  }
}