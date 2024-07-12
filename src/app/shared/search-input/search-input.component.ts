import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-search-input',
  templateUrl: './search-input.component.html',
  styleUrls: ['./search-input.component.scss']
})
export class SearchInputComponent implements OnInit {

  @Output() inputEvent = new EventEmitter<string>();


  constructor() { }

  ngOnInit(): void {
  }

  keyup(text:string){
    this.inputEvent.emit(text);
  }

}
