import { Component, OnInit, Inject } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import * as moment from 'moment';
import {ProjectDataService} from "../../services/project-data.service";
export class Articulo {

  constructor(public name: string, public dateIni: Date, public dateEnd: Date, public description: string,
              public title: string, public mode: number, public tag:any) {
    }
}
@Component({
  selector: 'app-edit-tasks-dialog',
  templateUrl: './edit-tasks-dialog.component.html',
  styleUrls: ['./edit-tasks-dialog.component.scss']
})
export class EditTasksDialogComponent implements OnInit{
  tags: any;
constructor(
    private PDservice: ProjectDataService,
    public dialogRef: MatDialogRef<EditTasksDialogComponent>,
    @ Inject(MAT_DIALOG_DATA) public data: Articulo) {}

  async ngOnInit() {
    this.tags = await this.PDservice.getTags(window.sessionStorage.getItem('authCookie'))
    console.log(this.data.name)
    console.log(this.data.tag)
  }

  cancelar() {
    this.dialogRef.close();
  }
  onDateChange(event: { value: moment.MomentInput; }) {
     this.data.dateIni = moment(event.value).toDate();
  }
  onDateEndChange(event: { value: moment.MomentInput; }) {
     this.data.dateEnd = moment(event.value).toDate();
  }
}
