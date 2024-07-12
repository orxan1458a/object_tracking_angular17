import { Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss'],
})
export class ButtonComponent implements OnInit {

  @Output()
  onClickEmitter = new EventEmitter();

  @Input() buttonText:string='';
  @Input() buttonColor:string='';
  @Input() disabled:boolean=false;


  constructor() { }

  ngOnInit(): void {
  }

  onClickAction() {
    this.onClickEmitter.emit('clicked');
  }
}