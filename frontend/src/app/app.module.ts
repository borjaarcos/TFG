import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AuthenticationService } from './services/authentication.service';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatDialogModule} from "@angular/material/dialog";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatSliderModule} from "@angular/material/slider";
import {MatButtonModule} from "@angular/material/button";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatCardModule} from "@angular/material/card";
import {MatInputModule} from "@angular/material/input";
import {HttpClientModule} from "@angular/common/http";
import { ProjectsComponent } from './components/projects/projects.component';
import {MatIconModule} from "@angular/material/icon";
import {TasklistGanttComponent} from './components/tasklist-gantt/tasklist-gantt.component';
import {MatSidenavModule} from "@angular/material/sidenav";
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatListModule} from "@angular/material/list";
import {DateAdapter, MAT_DATE_FORMATS, MatOptionModule} from "@angular/material/core";
import {MatSelectModule} from "@angular/material/select";
import { EditTasksDialogComponent } from './components/edit-tasks-dialog/edit-tasks-dialog.component';
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MAT_MOMENT_DATE_FORMATS, MatMomentDateModule, MomentDateAdapter} from '@angular/material-moment-adapter';
import {MatMenuModule} from "@angular/material/menu";
import { CodidgoArrastrarComponent } from './components/codidgo-arrastrar/codidgo-arrastrar.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ProjectsComponent,
    TasklistGanttComponent,
    EditTasksDialogComponent,
    CodidgoArrastrarComponent
  ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        MatDialogModule,
        FormsModule,
        ReactiveFormsModule,
        MatButtonModule,
        MatSliderModule,
        MatFormFieldModule,
        MatCardModule,
        MatInputModule,
        HttpClientModule,
        MatIconModule,
        MatSidenavModule,
        MatToolbarModule,
        MatListModule,
        MatOptionModule,
        MatSelectModule,
        MatDatepickerModule,
        MatMomentDateModule,
        MatMenuModule
    ],
  providers: [{provide: DateAdapter, useClass: MomentDateAdapter},
  { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS }],
  bootstrap: [AppComponent]
})
export class AppModule { }
