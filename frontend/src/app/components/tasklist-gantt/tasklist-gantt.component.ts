import { Component } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {ProjectDataService} from "../../services/project-data.service";
import {MatDialog} from '@angular/material/dialog';
import {Articulo, EditTasksDialogComponent} from "../edit-tasks-dialog/edit-tasks-dialog.component";
import {bimonthlyCalendar, weeklyCalendar} from './calendarFunct';
import * as moment from "moment";
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
  weekCalendar: any;
  reloadList: boolean = true;
  currentMonth: number = 0;
  today = new Date();
  beginDate: Date = new Date();
  endDate = new Date();
  currentYear: number=this.today.getFullYear();
  clients: number = 0;
  dragTaskData: any;
  calendarMode= 0;
   tags: any;
  constructor(
        private _router: Router,
        private aRouter: ActivatedRoute,
        private PDservice: ProjectDataService,
        public dialog: MatDialog,
    ) {
        this.projectId = this.aRouter.snapshot.paramMap.get('id');
    }

  async loadData() {
    this.beginDate = new Date(this.today.getTime() + (1000 * 60 * 60 * 24 * -91));
    this.endDate = new Date(this.today.getTime() + (1000 * 60 * 60 * 24 * 91));
    return this.PDservice.getTasklist(this.projectId, window.sessionStorage.getItem('authCookie'), this.stringParser(this.beginDate), this.stringParser(this.endDate))

  }
  async ngOnInit(): Promise<void> {
    this.tags = await this.PDservice.getTags(window.sessionStorage.getItem('authCookie'))
    console.log(this.tags)
    const storedToday = localStorage.getItem('today');
    if (storedToday) {
      this.today = new Date(JSON.parse(storedToday));
    }
    // Petition to the API
    this.data = await this.loadData()
    this.tasklists = this.data['tasklists']
    this.subTasks = this.data['subtasks']
    for(let tasklist in this.tasklists){
      // Using tasklist as key because value equals to the ordinal number of this.tasklists
      this.taskVisible[this.tasklists[tasklist].name] = true;
      for(let content in this.tasklists[tasklist].tasks){
        // Same here
        this.taskVisible[this.tasklists[tasklist].tasks[content].content] = true;
        for(let predecessors in this.tasklists[tasklist].tasks[content].predecessors){
          this.taskVisible[this.tasklists[tasklist].tasks[content].predecessors[predecessors].name] = true;
        }
      }
    }

    console.log(this.subTasks);
    console.log(this.tasklists);
    this.makeCalendar();
    console.log(this.weekCalendar)
    this.clients = 100/this.weekCalendar['clients'].length
  }

  //Deleting tw-auth cookie
  logout(){
    window.sessionStorage.clear();
    this._router.navigate(['login']);
  }

  makeCalendar(){
    if(this.calendarMode==1){
      this.weekCalendar = bimonthlyCalendar(this.subTasks, this.today)
    }else{
      this.weekCalendar = weeklyCalendar(this.subTasks, this.today)
    }
  }

  //Function that update tasks. Formatting is needed due to a bad format type of data(Moment) on mat-datepicker
  updateTask(taskid: string, name: string, mode: number, date: any, description: string, dateEnd: any, tag: any) {
    // Obtener los valores del año, mes y día
    let formattedDate=date;
    if (date instanceof Date){
      formattedDate = this.stringParser(date);
    }
    let formattedDateEnd= dateEnd;
    if(dateEnd instanceof Date){
      formattedDateEnd = this.stringParser(dateEnd);
    }
    this.PDservice.editTask(window.sessionStorage.getItem('authCookie'), taskid, name, description, mode, formattedDate, formattedDateEnd, tag)
    window.location.reload();
  }

  //Opening dialog to edit or create tasks
  openDialog(id: any, mode: number, title: string, name: any, description:any, dateIni: any, dateEnd: any, tag: any) {
    const taskEditionDialog = this.dialog.open(EditTasksDialogComponent, {
      data: new Articulo(name, dateIni, dateEnd,description, title, mode, tag)
    });

    taskEditionDialog.afterClosed().subscribe((result) => {
      if (result === 'ok') {
        // Acciones a realizar si se hizo clic en "OK"

        if (result.tag == undefined) {
          result.tag = ""
        }
        this.updateTask(id, result.name, mode, result.dateIni, result.description, result.dateEnd, result.tag);
      }
    });



  }

  async changeDate(direction: number) {
    if(this.calendarMode == 0){
      direction = 7 * (direction)
      this.today.setDate(this.today.getDate() + direction);
    } else{
      direction = 30 * (direction)
      this.today.setDate(this.today.getDate() + direction);
    }
    localStorage.setItem('today', JSON.stringify(this.today));
    if (this.today.getTime() <= this.beginDate.getTime() || this.today.getTime() >= this.endDate.getTime()) {
      this.data = await this.loadData()
      this.tasklists = this.data['tasklists']
      this.subTasks = this.data['subtasks']
      console.log(this.subTasks)
    }
    this.currentYear = this.today.getFullYear();
    this.reloadList = false;
    this.makeCalendar();
    this.reloadList = true;

  }

  allowDrop(event: any) {
    event.preventDefault();
  }

  dragTask(event: any, task:any, sourceWeek: any) {
    this.dragTaskData = { task, sourceWeek };
    document.body.classList.add('drag-cursor');
  }

  dropTask(event: any, targetWeek: any) {
    event.preventDefault();
    document.body.classList.remove('drag-cursor');
    if (this.dragTaskData) {
      const { task, sourceWeek } = this.dragTaskData;
      if (sourceWeek !== targetWeek) {
        //Get actual start-date
        let startDate = this.dateParser(task['start-date']);

        //Get actual due-date
        let actendDate = this.dateParser(task['due-date']);

        //Difference between dates
        const diff = actendDate.getTime() - startDate.getTime();
        const dayDiff = Math.floor(diff / (1000 * 60 * 60 * 24));

        //Get drop area date
        let dateString = targetWeek+"/"+this.currentYear;
        let [day, month, year] = dateString.split('/');
        const dateObj = new Date(+year, +month - 1, +day);

        let endDate= new Date(dateObj.getTime()+(1000 * 60 * 60 * 24 * dayDiff));
        this.updateTask(task['id'], task['content'], 3, dateObj, task['description'], endDate, task['tag']);
        /*
        for(let week of this.weekCalendar['weekPlan'] ){
          if(week['week'] == sourceWeek)
            week['tasks'] = week['tasks'].filter((t: any) => t !== task);
          if(week['week'] == targetWeek)
            week['tasks'].push(task)
        }*/
        this.dragTaskData = null;
      }
    }
  }

  dateParser(date:string){
    let parsedDate = date.slice(0, 4) + "/" + date.slice(4, 6) + "/" + date.slice(6, 8);
    let convertedDate:Date =new Date(parsedDate);
    return convertedDate
  }

  stringParser(date:Date){
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    let formattedDate = year + "" + month + "" + day

    return formattedDate
  }

  changeMode(mode: number) {
    this.calendarMode = mode;
    this.loadData();
    this.makeCalendar();
  }
}





