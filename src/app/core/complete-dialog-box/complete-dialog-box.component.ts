import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-complete-dialog-box',
  templateUrl: './complete-dialog-box.component.html',
  styleUrls: ['./complete-dialog-box.component.scss'],
  encapsulation:ViewEncapsulation.None
})
export class CompleteDialogBoxComponent implements OnInit {

  title:string='';


  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<CompleteDialogBoxComponent>,
    private translate:TranslateService

  ) {    
  }

  ngOnInit(): void {
    this.translate.get(this.data.title).subscribe (x=> this.title = x);
  }

  ok(){
    this.dialogRef.close();
  }
}
