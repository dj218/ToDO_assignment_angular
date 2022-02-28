import { Component, OnInit } from '@angular/core';
import { TodolistService } from '../services/todolist.service';
import { UserService } from '../services/user.service';
import { Task } from '../models/task.model';
import { Filter } from '../models/filter.model';

@Component({
  selector: 'app-todolist',
  templateUrl: './todolist.component.html',
  styleUrls: ['./todolist.component.css']
})
export class TodolistComponent implements OnInit {

  tasks : Task[] = [];
  userEmail : string = '';
  deleteMode : boolean = false;
  filters : Filter ;
  heading : string ;

  constructor(private taskService : TodolistService,private userService : UserService) { }

  ngOnInit(): void {

    this.userEmail = this.userService.activteUserEmail;

    this.taskService.filters = new Filter(this.userEmail,[],'','',[],'');
    this.filters = this.taskService.filters;

    this.tasks = this.taskService.getTasks()

    this.taskService.tasksFilterApplied.subscribe((filteredTasks)=>{
      this.tasks = filteredTasks;
      this.filters = this.taskService.filters;

      this.setheading();
    })
    this.setheading();
  }

  setheading(){
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

  selectTaskToDeleteButtonClicked(){
    this.taskService.tasksToDelete = [];
    this.deleteMode = true;
  }

  onDelete(){
    if(this.taskService.tasksToDelete.length == 0){
      let text = "You haven't selected any tasks to delete";
      if(confirm(text) == true){}
    }
    else{
      let text="Are you sure , you want to delete the selected tasks?";

      if(confirm(text) == true){
        this.taskService.deleteTasks();
      }
    }
    this.onCancel();
  }

  onCancel(){
    this.deleteMode = false;
    this.taskService.tasksToDelete = [];
  }


}
