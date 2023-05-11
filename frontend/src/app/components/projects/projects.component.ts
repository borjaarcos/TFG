import { Component } from '@angular/core';
import {AuthenticationService} from "../../services/authentication.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss']
})
export class ProjectsComponent {
  // @ts-ignore
  cookie: string = window.sessionStorage.getItem('authCookie');
  projects: any[] = [];
  originalProject: any[] = [];
  searchTerm: string = '';
  constructor(private _authService: AuthenticationService,
              private _router: Router,) {

  }
  async ngOnInit(): Promise<void> {
    this.projects = await this._authService.projects(this.cookie);
    this.originalProject = this.projects;
    console.log(this.projects);
  }

  getProjects(){
    console.log(this.projects);
  }

  filterList() {
    console.log("filter")
    this.projects = this.originalProject.filter(project => {
    // Filtra la lista de elementos usando la búsqueda actual
      return project.name.toLowerCase().includes(this.searchTerm.toLowerCase());
    });
  }

  logout(){
    window.sessionStorage.clear();
    this._router.navigate(['login']);
  }
}

