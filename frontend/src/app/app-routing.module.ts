import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component'
import {ProjectsComponent} from "./components/projects/projects.component";
import {TasklistGanttComponent} from "./components/tasklist-gantt/tasklist-gantt.component";
import { AuthGuard } from './services/auth-guard.service';
const routes: Routes = [
  {
      path: 'login',
      component: LoginComponent,
  },
  {
      path: '',
      component: ProjectsComponent,
      canActivate: [AuthGuard]
  },
  {
      path: 'tasklist/:id',
      component: TasklistGanttComponent,
      canActivate: [AuthGuard]
  }
  ];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
