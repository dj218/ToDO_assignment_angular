import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Filter } from 'src/app/models/filter.model';
import { TodolistService } from 'src/app/services/todolist.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-todolist-header',
  templateUrl: './todolist-header.component.html',
  styleUrls: ['./todolist-header.component.css']
})
export class TodolistHeaderComponent implements OnInit {

  itemFilterForm : FormGroup;

  initialItemFilterFormValue ;

  itemType: Array<any> = [
    { name: 'IsCompleted', value: 'completedItems' },
    { name: 'Ispending', value: 'dueItems' }
  ];

  itemCategory: Array<any> = [
    { name: 'Important', value: 'important' },
    { name: 'Work', value: 'work' },
    { name: 'Extracurricular', value: 'extracurricular' },
    { name: 'Sports', value: 'sports' }
  ]

  constructor(
      private fb: FormBuilder,
      private userService : UserService,
      private todolistService : TodolistService) {

    this.itemFilterForm = this.fb.group({
      itemTypeArray: this.fb.array(this.itemType.map(el => new FormControl(false))),
      itemCategoryArray: this.fb.array(this.itemCategory.map(el => new FormControl(false))),
      startDate : ['',[]],
      endDate : ['',[]],
      sortItems : ['',[]]
    })
    this.initialItemFilterFormValue = this.itemFilterForm.value;
  }

  ngOnInit(): void {
  }


  OnClickReset(){
    this.todolistService.filters = new Filter(this.userService.activteUserEmail,[],'','',[],'');
    this.todolistService.GetItems();
    this.itemFilterForm.reset(this.initialItemFilterFormValue);
  }


  OnSubmit() {
    let userEmail = this.userService.activteUserEmail;
    let itemTypeArray = [];
    let startDate = this.itemFilterForm.get('startDate').value;
    let endDate = this.itemFilterForm.get('endDate').value;
    let itemCategoryArray = [];
    let sortType = this.itemFilterForm.get('sortItems').value;

    let i=0;
    (<FormArray>this.itemFilterForm.get('itemTypeArray')).controls.forEach(control => {
      if(control.value)
      itemTypeArray.push(this.itemType[i].value)
      i++;
    });

    let j=0;
    (<FormArray>this.itemFilterForm.get('itemCategoryArray')).controls.forEach(control => {
      if(control.value)
        itemCategoryArray.push(this.itemCategory[j].value)
      j++;
    });

    this.todolistService.filters = new Filter(userEmail,itemTypeArray,startDate,endDate,itemCategoryArray,sortType);
    this.todolistService.GetItems();
  }

}

