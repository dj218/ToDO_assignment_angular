import { Component, OnInit } from '@angular/core';
import { TodolistService } from '../services/todolist.service';
import { UserService } from '../services/user.service';
import { Item } from '../models/item.model';
import { Filter } from '../models/filter.model';

@Component({
  selector: 'app-todolist',
  templateUrl: './todolist.component.html',
  styleUrls: ['./todolist.component.css']
})
export class TodolistComponent implements OnInit {

  todolist : Item[] = [];
  userEmail : string = '';
  deleteMode : boolean = false;
  filters : Filter ;
  heading : string ;

  constructor(private todolistService : TodolistService,private userService : UserService) {
    this.userEmail = this.userService.activteUserEmail;
    this.todolistService.filters = new Filter(this.userEmail,[],'','',[],'');
    this.filters = this.todolistService.filters;
   }

  ngOnInit(): void {

    this.todolist = this.todolistService.GetTasks()

    this.todolistService.tasksFilterApplied.subscribe((filteredTasks)=>{
      this.todolist = filteredTasks;
      this.filters = this.todolistService.filters;

      this.SetHeading();
    })
    this.SetHeading();
  }

  SetHeading(){
    if(
      this.filters.endDate == '' &&
      this.filters.sortType == '' &&
      this.filters.startDate == '' &&
      this.filters.taskCategoryArray.length ==0 &&
      this.filters.taskTypeArray.length == 0)
    this.heading = 'All Tasks';

    else
      this.heading = 'Filtered Tasks';
  }

  SelectTaskToDeleteButtonClicked(){
    this.todolistService.tasksToDelete = [];
    this.deleteMode = true;
  }

  OnDelete(){
    if(this.todolistService.tasksToDelete.length == 0){
      let text = "You haven't selected any tasks to delete";
      if(confirm(text) == true){}
    }
    else{
      let text="Are you sure , you want to delete the selected tasks?";

      if(confirm(text) == true){
        this.todolistService.DeleteTasks();
      }
    }
    this.OnCancel();
  }

  OnCancel(){
    this.deleteMode = false;
    this.todolistService.tasksToDelete = [];
  }
}
