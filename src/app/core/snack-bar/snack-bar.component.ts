import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'app-snack-bar',
  templateUrl: './snack-bar.component.html',
  styleUrls: ['./snack-bar.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SnackBarComponent implements OnInit {
  title: string = '';
  icon_url: string = '';
  color: string = '';
  positiveKeyword: string[] = ['copy_to_clipboard', 'notification_true', 'fill_cell']

  constructor(
    @Inject(MAT_SNACK_BAR_DATA) public data: { title: string, is_notification: string },
    private translate: TranslateService
  ) { }

  ngOnInit(): void {

    this.translate.get(this.data.title).subscribe(d => this.title = d);

    if (this.data.title == 'copy_to_clipboard') {
      this.icon_url = '../../../assets/images/copy_icon_turqoise.svg'
    }

    else if (this.data.title == 'notification_true') {
      this.icon_url = '../../../assets/images/notification_icon_turqoise.svg'
    }
    else if (this.data.title == 'notification_false') {
      this.icon_url = '../../../assets/images/mute_icon_red.svg'
    }

    else if (this.data.title == 'username_or_password_invalid') {
      this.icon_url = '../../../assets/images/exclamation_red.svg'
    }
    else if (this.data.title == 'fill_cell'|| this.data.title=='check_cell_correctly') {
      this.icon_url = '../../../assets/images/exclamation_red.svg'
    }
    else if (this.data.title=='exist_username_error') {
      this.icon_url = '../../../assets/images/exclamation_red.svg'
    }
    else if (this.data.title=='passwords_is_not_same') {
      this.icon_url = '../../../assets/images/exclamation_red.svg'
    }
    else if (this.data.title=='many_login_attempt_error') {
      this.icon_url = '../../../assets/images/exclamation_red.svg'
    }

    else if (this.data.title=='phone_already_is_exist') {
      this.icon_url = '../../../assets/images/exclamation_red.svg';
    }
    else if (this.data.title=='mail_already_is_exist') {
      this.icon_url = '../../../assets/images/exclamation_red.svg'
    }
  }

}
