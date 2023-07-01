import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TasklistGanttComponent } from './tasklist-gantt.component';

describe('TasklistGanttComponent', () => {
  let component: TasklistGanttComponent;
  let fixture: ComponentFixture<TasklistGanttComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TasklistGanttComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TasklistGanttComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
