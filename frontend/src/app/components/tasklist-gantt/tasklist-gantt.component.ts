import { Component } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {ProjectDataService} from "../../services/project-data.service";
import {MatDialog} from '@angular/material/dialog';
import {Articulo, EditTasksDialogComponent} from "../edit-tasks-dialog/edit-tasks-dialog.component";
import { weeklyCalendar } from './calendarFunct';
interface MyDictionary {
  [key: string]: boolean;
}

@Component({
  selector: 'app-tasklist-gantt',
  templateUrl: './tasklist-gantt.component.html',
  styleUrls: ['./tasklist-gantt.component.scss']
})
export class TasklistGanttComponent {
  projectId: string | null;
  tasklists: any;
  data: any;
  // Dict to filter tasks
  taskVisible: MyDictionary = {};
  subTasks: any;
  constructor(
        private _router: Router,
        private aRouter: ActivatedRoute,
        private PDservice: ProjectDataService,
        public dialog: MatDialog,
    ) {
        this.projectId = this.aRouter.snapshot.paramMap.get('id');
    }
  async ngOnInit(): Promise<void> {
      // @ts-ignore
      // Petition to the API
    this.data = await this.PDservice.getTasklist(this.projectId, window.sessionStorage.getItem('authCookie'))
    this.tasklists = this.data['tasklists']
    this.subTasks = this.data['subtasks']

    console.log(this.data)
    console.log(this.tasklists)
    console.log(this.subTasks)
    console.log("endingjjfds")

  }
  //After getting task proceed to fill visible variable to filter tasks
  ngAfterViewInit() {
    for(let tasklist in this.tasklists){
      // @ts-ignore
      // Using tasklist as key because value equals to the ordinal number of the task
      this.taskVisible[this.tasklists[tasklist].name] = false;
      for(let content in this.tasklists[tasklist].tasks){
        // Same here
        this.taskVisible[this.tasklists[tasklist].tasks[content].content] = false;
        for(let predecessors in this.tasklists[tasklist].tasks[content].predecessors){
          this.taskVisible[this.tasklists[tasklist].tasks[content].predecessors[predecessors].name] = true;
        }
      }
    }
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth() + 1;
    console.log(this.subTasks);
    console.log(this.tasklists);
    weeklyCalendar(currentMonth, currentYear, this.subTasks)
  }

  //Deleting tw-auth cookie
  logout(){
    window.sessionStorage.clear();
    this._router.navigate(['login']);
  }

  //Function that update tasks. Formatting is needed due to a bad format type of data(Moment) on mat-datepicker
  updateTask(taskid:string, name: string, mode: number, date: Date){
    // Obtener los valores del año, mes y día
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const formattedDate = year+""+month+""+day
    this.PDservice.editTask(window.sessionStorage.getItem('authCookie'), taskid, name, mode, formattedDate)
    window.location.reload();
  }

  //Opening dialog to edit or create tasks
  abrirDialogo(id: string, mode: number, title: string, name: string) {
    const taskEditionDialog = this.dialog.open(EditTasksDialogComponent, {
      data: new Articulo(name, new Date(), title, mode)
    });

    taskEditionDialog.afterClosed().subscribe((result) => {
      this.updateTask(id, result.name, mode, result.date);
    });
  }
}





