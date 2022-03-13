import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Filter } from 'src/app/models/filter.model';
import { TodolistService } from 'src/app/services/todolist.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-todolist-header',
  templateUrl: './todolist-header.component.html',
  styleUrls: ['./todolist-header.component.css']
})
export class TodolistHeaderComponent implements OnInit {

  taskFilterForm : FormGroup;

  initialTaskFilterFormValue ;

  taskType: Array<any> = [
    { name: 'IsCompleted', value: 'completedTasks' },
    { name: 'Ispending', value: 'dueTasks' }
  ];

  taskCategory: Array<any> = [
    { name: 'Important', value: 'important' },
    { name: 'Work', value: 'work' },
    { name: 'Extracurricular', value: 'extracurricular' },
    { name: 'Sports', value: 'sports' }
  ]

  constructor(
      private fb: FormBuilder,
      private router : Router ,
      private userService : UserService,
      private todolistService : TodolistService) {

    this.taskFilterForm = this.fb.group({
      taskTypeArray: this.fb.array(this.taskType.map(el => new FormControl(false))),
      taskCategoryArray: this.fb.array(this.taskCategory.map(el => new FormControl(false))),
      startDate : ['',[]],
      endDate : ['',[]],
      sortTasks : ['',[]]
    })
    this.initialTaskFilterFormValue = this.taskFilterForm.value;
  }

  ngOnInit(): void {
  }

  OnClickCreateTask(){
    this.router.navigate(['/todolist/create'])
  }

  OnClickReset(){

    this.todolistService.filters = new Filter(this.userService.activteUserEmail,[],'','',[],'');
    this.todolistService.GetTasks();
    this.ResetForm();
  }

  ResetForm(){
    (<FormArray>this.taskFilterForm.controls['taskTypeArray']).reset();
    (<FormArray>this.taskFilterForm.controls['taskCategoryArray']).reset();
    this.taskFilterForm.reset(this.initialTaskFilterFormValue);
  }


  OnSubmit() {
    let userEmail = this.userService.activteUserEmail;
    let taskTypeArray = [];
    let startDate = this.taskFilterForm.get('startDate').value;
    let endDate = this.taskFilterForm.get('endDate').value;
    let taskCategoryArray = [];
    let sortType = this.taskFilterForm.get('sortTasks').value;

    let i=0;
    (<FormArray>this.taskFilterForm.get('taskTypeArray')).controls.forEach(control => {
      if(control.value)
        taskTypeArray.push(this.taskType[i].value)
      i++;
    });

    let j=0;
    (<FormArray>this.taskFilterForm.get('taskCategoryArray')).controls.forEach(control => {
      if(control.value)
        taskCategoryArray.push(this.taskCategory[j].value)
      j++;
    });

    this.todolistService.filters = new Filter(userEmail,taskTypeArray,startDate,endDate,taskCategoryArray,sortType);
    this.todolistService.GetTasks();
  }

}

