import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component'
import {ProjectsComponent} from "./components/projects/projects.component";
import {TasklistGanttComponent} from "./components/tasklist-gantt/tasklist-gantt.component";

const routes: Routes = [
  {
      path: '',
      component: LoginComponent
  },
  {
      path: 'projects',
      component: ProjectsComponent
  },
  {
      path: 'tasklist/:id',
      component: TasklistGanttComponent
  }
  ];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
