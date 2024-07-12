import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-language-popup',
  templateUrl: './language-popup.component.html',
  styleUrls: ['./language-popup.component.scss']
})
export class LanguagePopupComponent implements OnInit {

  @Input()
  language:string='';

  constructor() { }

  ngOnInit(): void {
  }

  changeLanguage() {
    if (this.language == 'az') {
      localStorage.setItem('language', 'eng')
    }
    else {
      localStorage.setItem('language', 'az')
    }
    window.location.reload()
  }
}
