import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditTasksDialogComponent } from './edit-tasks-dialog.component';

describe('EditTasksDialogComponent', () => {
  let component: EditTasksDialogComponent;
  let fixture: ComponentFixture<EditTasksDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditTasksDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditTasksDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
