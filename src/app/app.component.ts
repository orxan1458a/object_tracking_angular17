import { Component, ViewEncapsulation } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  encapsulation:ViewEncapsulation.None
})
export class AppComponent {

  constructor(private translate: TranslateService) { };

  ngOnInit(): void {
    let currentLang = localStorage.getItem('language');
    if (currentLang == null) {
      localStorage.setItem('language', 'eng');
      currentLang = 'eng';
    }

    this.translate.use(String(currentLang));
  }
}