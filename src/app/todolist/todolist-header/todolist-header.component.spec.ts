import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TodolistHeaderComponent } from './todolist-header.component';

describe('TodolistHeaderComponent', () => {
  let component: TodolistHeaderComponent;
  let fixture: ComponentFixture<TodolistHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TodolistHeaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TodolistHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
