import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TodolistEditComponent } from './todolist-edit.component';

describe('TodolistEditComponent', () => {
  let component: TodolistEditComponent;
  let fixture: ComponentFixture<TodolistEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TodolistEditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TodolistEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
