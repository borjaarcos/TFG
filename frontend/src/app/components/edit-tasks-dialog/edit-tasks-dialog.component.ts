import { Component, OnInit, Inject } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import * as moment from 'moment';
export class Articulo {

  constructor(public name: string, public date: Date, public title: string, public mode: number) {
    }
}
@Component({
  selector: 'app-edit-tasks-dialog',
  templateUrl: './edit-tasks-dialog.component.html',
  styleUrls: ['./edit-tasks-dialog.component.scss']
})
export class EditTasksDialogComponent implements OnInit{
constructor(
    public dialogRef: MatDialogRef<EditTasksDialogComponent>,
    @ Inject(MAT_DIALOG_DATA) public data: Articulo) {}

  ngOnInit() {
  }

  cancelar() {
    this.dialogRef.close();
  }
  onDateChange(event: { value: moment.MomentInput; }) {
     this.data.date = moment(event.value).toDate();
  }

}
